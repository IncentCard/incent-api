import * as bodyParser from "body-parser";
import express from "express";
import * as admin from "firebase-admin";
import passport from "passport";
import * as authController from "./controllers/auth";
import * as userController from "./controllers/user";
import * as utility from "./controllers/utility";
import * as waitlistController from "./controllers/waitlist";
import DatabaseClient from "./database/DatabaseClient";
import MarqetaClient from "./database/MarqetaClient";

export const firebase = admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json"),
  databaseURL: "https://incentcard.firebaseio.com",
});

const databaseLocation = process.env.DATABASE_URL || "postgres://localhost:5432/test";
export const marqetaClient: MarqetaClient = new MarqetaClient();
export const database = new DatabaseClient(databaseLocation, admin.firestore(), marqetaClient);

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.set("port", process.env.PORT || 3001);

// root endpoint
app.get("/", utility.index);

// user endpoint
app.post("/user", authController.isAuthenticated, userController.postUser);
app.put("/user", authController.isAuthenticated, userController.putUser);
app.get("/user/:id", authController.isAuthenticated, userController.getUser);

app.post("/waitlist", authController.isAuthenticated, authController.isAllowed, waitlistController.postWaitList);
// STUFF BELOW HERE IS LEGACY AND WILL BE DELETED EVENTUALLY

// app.get("/ping", utility.ping);app.post("/user/login", userController.postLogin);

// app.get("/user/kyc", userController.kyc);

// app.post("/admin", adminController.postAdmin);
// app.post("/admin/login", adminController.login);

export default app;
