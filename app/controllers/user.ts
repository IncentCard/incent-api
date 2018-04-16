import { Request, Response } from "express";
import * as request from "request";
import * as uuid from "uuid";
import * as config from "../config";
import { User } from "../models/User";

function postUserToMarqeta(payload: string) {
  request.post({
    body: payload,
    headers: {
              "Accept": "application/json",
              "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
              "content-type": "application/json",
              },
    url: config.marqeta + "users",
  }, (error, response, body) => {
    console.log(body);
  });
}

export let postSignUp = (req: Request, res: Response) => {
  // verify parameters

  // check token is valid (this returns an id for the user)

  const userId: string = uuid.v4();
  const user: User = new User({id: userId});

  postUserToMarqeta(JSON.stringify(user.convertToMarqeta()));

  // store password in DB for user

  // generate a login token
  let loginToken: string;

  loginToken = uuid.v4();

  // return the login token
  res.json({
    authToken: loginToken,
    userId,
   });
};

export let putUser = (req: Request, res: Response) => {
  const payload = req.body;
  console.log(payload);
  if (!payload) {
    res.json({
      error: true,
    });
    return;
  }
  const user = new User(payload);
  request.put({
    body: JSON.stringify(user.convertToMarqeta()),
    headers: {
              "Accept": "application/json",
              "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
              "content-type": "application/json",
              },
    url: config.marqeta + "users/" + user.id,
  }, (error, response, body) => {
    console.log(body);
  });
  res.json();
};

// get marqeta auth token for user
export let getMarqetaTokenForUser = (req: Request, res: Response) => {
  const userToken = req.query.user;
  console.log(userToken);
  if (!userToken) {
    res.json({
      error: true,
    });
    return;
  }

  const payload = {
    user_token: userToken,
  };

  request.post({
    body: JSON.stringify(payload),
    headers: {
              "Accept": "application/json",
              "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
              "content-type": "application/json",
              },
    url: config.marqeta + "users/auth/login",
  }, (error, response, body) => {
    console.log(body);
    body = JSON.parse(body);
    res.json({
      token: body.access_token.token,
    });
  });
};

export let kyc = (req: Request, res: Response) => {
  const userToken = req.query.user;

  const payload = {
    manual_override: false,
    user_token: userToken,
  };

  request.post({
    body: JSON.stringify(payload),
    headers: {
              "Accept": "application/json",
              "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
              "content-type": "application/json",
              },
    url: config.marqeta + "kyc",
  }, (error, response, body) => {
    console.log(body);
    body = JSON.parse(body);
    res.json({
      kyc_token: body.token,
    });
  });
};
