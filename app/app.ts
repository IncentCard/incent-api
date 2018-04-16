import express from "express";

import * as bodyParser from "body-parser";
import * as helloWorldController from "./controllers/helloWorld";
import * as userController from "./controllers/user";

const app = express();
app.use(bodyParser.json());

app.set("port", process.env.PORT || 3000);

app.get("/", helloWorldController.index);

app.post("/signup", userController.postSignUp);

app.put("/user", userController.putUser);

app.get("/user/marqetatoken", userController.getMarqetaTokenForUser);

export default app;
