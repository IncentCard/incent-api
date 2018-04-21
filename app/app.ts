import express from "express";

import * as bodyParser from "body-parser";
import * as utility from "./controllers/utility";
import * as userController from "./controllers/user";

const app = express();
app.use(bodyParser.json());

app.set("port", process.env.PORT || 3001);

app.get("/", utility.index);

app.get("/ping", utility.ping);

app.post("/signup", userController.postSignUp);

app.put("/user", userController.putUser);

app.post("/user/login", userController.postLogin);

app.get("/user/kyc", userController.kyc);

export default app;
