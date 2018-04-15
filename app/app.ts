import express from "express";

import * as helloWorldController from "./controllers/helloWorld";
import * as userController from "./controllers/user";

const app = express();

app.set("port", process.env.PORT || 3000);

app.get("/", helloWorldController.index);

app.post("/signup", userController.postSignUp);

export default app;
