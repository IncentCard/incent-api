import express from "express";

import * as helloWorldController from "./controllers/helloWorld";

const app = express();

app.set("port", process.env.PORT || 3000);

app.get("/", helloWorldController.index);

export default app;

