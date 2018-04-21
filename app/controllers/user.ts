import { Request, Response } from "express";
import * as request from "request";
import * as uuid from "uuid";
import * as config from "../config";
import { User } from "../models/User";

export let postSignUp = (req: Request, res: Response) => {
  // verify parameters
  const data = req.body;

  // verify that the sign up token is valid and matches the passed in email
  // todo: verify the token

  // create a user based on passed in info

  const userId: string = uuid.v4();

  const user: User = new User({
    email: data.email,
    id: userId,
    password: data.password,
  });

  request.post({
    body: JSON.stringify(user.convertToMarqeta()),
    headers: {
              "Accept": "application/json",
              "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
              "content-type": "application/json",
              },
    url: config.marqeta + "users",
  }, (error, response, body) => {
    console.log(body);
    // todo: add response to database

    res.json(body);
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
    res.json(body);
  });
};

function login(email: string, password: string, userToken: string, callback: request.RequestCallback): string {
  const payload = {
    email,
    password,
    user_token: userToken,
  };

  let token: string;
  request.post({
    body: JSON.stringify(payload),
    headers: {
              "Accept": "application/json",
              "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
              "content-type": "application/json",
              },
    url: config.marqeta + "users/auth/login",
  }, callback);
  return token;
}

// get marqeta auth token for user
export let postLogin = (req: Request, res: Response) => {
  const data = req.body;
  const userToken = data.userToken;

  console.log(userToken);
  if (!userToken) {
    res.json({
      error: true,
    });
    return;
  }

  login(data.email, data.password, userToken, (error, response, body) => {
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
