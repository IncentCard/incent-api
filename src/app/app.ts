import * as bodyParser from "body-parser";
import express from "express";
import * as admin from "firebase-admin";
import passport from "passport";
import * as config from "./config";
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

export const marqetaClient: MarqetaClient = new MarqetaClient();
export const database = new DatabaseClient(admin.firestore(), marqetaClient);

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

// root endpoint
app.get("/", utility.index);

// ping marqeta to make sure connection is alive
app.get("/ping", utility.ping);

// user endpoint
app.post("/user", authController.isAuthenticated, userController.postUser);
app.put("/user", authController.isAuthenticated, userController.putUser);
app.get("/user/:id", authController.isAuthenticated, userController.getUser);

app.post("/waitlist", authController.isAuthenticated, authController.isAllowed, waitlistController.postWaitList);
app.put("/waitlist", authController.isAuthenticated, authController.isAllowed, waitlistController.putWaitList);
app.get("/waitlist/:email", authController.isAuthenticated, authController.isAllowed, waitlistController.getWaitList);

// STUFF BELOW HERE IS LEGACY AND WILL BE DELETED EVENTUALLY

// app.post("/user/login", userController.postLogin);

// app.get("/user/kyc", userController.kyc);

// app.post("/admin", adminController.postAdmin);
// app.post("/admin/login", adminController.login);

export default app;
