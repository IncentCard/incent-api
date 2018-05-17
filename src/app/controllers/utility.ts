import { Request, Response } from "express";
import * as request from "request";

export let index = (req: Request, res: Response) => {
  res.send("Hello world!");
};

export let ping = (req: Request, res: Response) => {
  request.get({
    headers: {
              Accept: "application/json",
              Authorization: "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
              },
    url: process.env.MARQETA + "ping",
  }, (error, response, body) => {
    res.send(body);
  });
};
