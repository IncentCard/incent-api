import { Request, Response } from "express";
import * as request from "request";
import { marqetaClient } from "../app";

export let index = (req: Request, res: Response) => {
  res.send("Hello world!");
};

export let ping = (req: Request, res: Response) => {
  marqetaClient.ping().then((response) => { res.send(response.data); });
};
