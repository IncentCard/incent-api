import { Request, Response } from "express";
import * as request from "request";
import * as uuid from "uuid";
import { database } from "../app";
import { User } from "../models/User";

export let postUser = (req: Request, res: Response) => {
  // verify parameters
  // todo: verify all headers are present for JSON data
  const data = req.body;

  // create a user based on passed in info
  const user: User = new User(data);
  user.id = uuid.v4();

  const postBody = JSON.stringify(user.convertToMarqeta());

  request.post({
    body: postBody,
    headers: {
      "Accept": "application/json",
      "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
      "content-type": "application/json",
    },
    url: process.env.MARQETA + "users",
  }, (error, response, body) => {
    console.log(body);

    // add response to database
    const createdUser: User = new User(JSON.parse(body), true);
    database.addUser(createdUser)
      .then(() => {
        res.json(createdUser.stringify());
      });
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

  console.log("traitor");
  const user = new User(payload);
  request.put({
    body: JSON.stringify(user.convertToMarqeta()),
    headers: {
      "Accept": "application/json",
      "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
      "content-type": "application/json",
    },
    url: process.env.MARQETA + "users/" + user.id,
  }, (error, response, body) => {
    console.log(body);
    if (error) {
      res.json(error);
    } else {
      database.updateUser(user);
      res.json(user.convertToJSON());
    }
  });
};

export let getUser = (req: Request, res: Response) => {
  const payload = req.body;
  console.log(payload);
  if (!payload) {
    res.json({
      error: true,
    });
    return;
  }

  database.getUser(req.params.id).then((user: User) => {
    res.json(user.convertToJSON());
  });
};

function login(email: string, password: string, userToken: string, callback: request.RequestCallback) {
  const payload = {
    email,
    password,
    user_token: userToken,
  };

  request.post({
    body: JSON.stringify(payload),
    headers: {
      "Accept": "application/json",
      "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
      "content-type": "application/json",
    },
    url: process.env.MARQETA + "users/auth/login",
  }, callback);
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
    url: process.env.MARQETA + "kyc",
  }, (error, response, body) => {
    console.log(body);
    body = JSON.parse(body);
    res.json({
      kyc_token: body.token,
    });
  });
};
