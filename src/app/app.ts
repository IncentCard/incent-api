import * as bodyParser from "body-parser";
import express from "express";
import passport from "passport";
import * as adminController from "./controllers/admin";
import * as authController from "./controllers/auth";
import * as userController from "./controllers/user";
import * as utility from "./controllers/utility";
import DatabaseClient from "./database/DatabaseClient";

export const database = new DatabaseClient(process.env.DATABASE_URL || "postgres://localhost:5432/test");

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.set("port", process.env.PORT || 3001);

// root endpoint
app.get("/", utility.index);

// ping endpoint
app.get("/ping", utility.ping);

// user endpoint
app.post("/user", authController.isAuthenticated, userController.postUser);
app.put("/user", authController.isAuthenticated, userController.putUser);
app.get("/user/:id", authController.isAuthenticated, userController.getUser);

// STUFF BELOW HERE IS LEGACY AND WILL BE DELETED EVENTUALLY
app.post("/user/login", userController.postLogin);

app.get("/user/kyc", userController.kyc);

app.post("/admin", adminController.postAdmin);
app.post("/admin/login", adminController.login);

export default app;
