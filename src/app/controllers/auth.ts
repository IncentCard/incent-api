import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import * as admin from "firebase-admin";
import passport from "passport";
import * as bearer from "passport-http-bearer";
import { database, firebase } from "../app";
import { serviceLog } from "../configLog4j";
import { Admin } from "../models/Admin";


// passport.use(new passportStrategy.BasicStrategy(
//     (username, password, callback) => {
//         console.log("Trying to authenticate");
//         database.getAdmin(username).then((admin: Admin) => {
//             if (!admin) { return callback(null, false); }
//             if (bcrypt.compareSync(password, admin.password)) {
//                return callback(null, admin);
//             } else {
//                 return callback(null, false);
//             }
//         });
//     },
// ));

// export const isAuthenticated = passport.authenticate("basic", {session: false});

interface AuthUser extends Express.User {
    uid: string;
}

function instanceOfAuthUser(object: any): object is AuthUser {
    return "uid" in object;
}

passport.use(new bearer.Strategy(
    (token, done) => {
        firebase.auth().verifyIdToken(token)
            .then((decodedToken: admin.auth.DecodedIdToken) => {
                return done(null, {uid: decodedToken.uid});
            })
            .catch((err) => {
                return done(err);
            });
    },
));

export const isAuthenticated = passport.authenticate("bearer", { session: false });

function evaluatePermissionEntry(permissions: string, method: string): boolean {
    const permissionList = permissions.split(",");
    return permissionList.indexOf("*") >= 0 || permissionList.indexOf(method) >= 0;
}

function checkPermission(permission: Permission, path: string, method: string): boolean {
    if (!permission || !path) {
        return false;
    }

    path = path.split("/")[1];
    switch (path) {
        case "waitlist": {
            return evaluatePermissionEntry(permission.waitlist, method);
        }
        default: {
            return true;
        }
    }
}

export const isAllowed = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !instanceOfAuthUser(req.user)) {
        res.sendStatus(403);
    } else {
        const user: AuthUser = req.user;
        database.getPermissions(req.user.uid)
            .then((permission: Permission) => {
                serviceLog.debug("Permission for " + req.user.uid + " " + JSON.stringify(permission));
                if (checkPermission(permission, req.path, req.method)) {
                    next();
                } else {
                    res.sendStatus(403);
                }
            })
            .catch((err) => {
                serviceLog.error("Couldn't evaluate permissions for " + req.user.uid);
                res.sendStatus(403);
            });
    }
};
