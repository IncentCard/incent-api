import * as bcrypt from "bcrypt";
import passport from "passport";
import * as passportStrategy from "passport-http";
import { database } from "../app";
import { Admin } from "../models/Admin";

passport.use(new passportStrategy.BasicStrategy(
    (username, password, callback) => {
        console.log("Trying to authenticate");
        database.getAdmin(username).then((admin: Admin) => {
            if (!admin) { return callback(null, false); }
            if (bcrypt.compareSync(password, admin.password)) {
               return callback(null, admin);
            } else {
                return callback(null, false);
            }
        });
    },
));

export const isAuthenticated = passport.authenticate("basic", {session: false});
