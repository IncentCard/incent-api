import { Request, Response } from "express";
import * as uuid from "uuid";
import { database } from "../app";
import { serviceLog } from "../configLog4j";
import { User } from "../models/User";

// todo: add error handling to all failed promises

export let postUser = (req: Request, res: Response) => {
  // verify parameters
  // todo: verify all headers are present for JSON data
  const data = req.body;

  // create a user based on passed in info
  data.id = data.id || uuid.v4();
  const user: User = new User(data);

  database.addUser(user)
    .then(() => {
      res.json(user.convertToJSON());
    });
};

export let putUser = (req: Request, res: Response) => {
  const payload = req.body;
  serviceLog.debug(payload);
  if (!payload) {
    res.json({
      error: true,
    });
    return;
  }

  const user = new User(payload);
  database.updateUser(user)
    .then(() => {
      res.json(user.convertToJSON());
    })
    .catch((err: Error) => {
      serviceLog.error(err.message);
      res.sendStatus(422);
    });
};

export let getUser = (req: Request, res: Response) => {
  const payload = req.body;
  if (!payload) {
    res.json({
      error: true,
    });
    return;
  }

  database.getUser(req.params.id)
    .then((user: User) => {
      res.json(user.convertToJSON());
  });
};

/////// Below here is deprecated ///////

// function login(email: string, password: string, userToken: string, callback: request.RequestCallback) {
//   const payload = {
//     email,
//     password,
//     user_token: userToken,
//   };

//   request.post({
//     body: JSON.stringify(payload),
//     headers: {
//       "Accept": "application/json",
//       "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
//       "content-type": "application/json",
//     },
//     url: process.env.MARQETA + "users/auth/login",
//   }, callback);
// }

// // get marqeta auth token for user
// export let postLogin = (req: Request, res: Response) => {
//   const data = req.body;
//   const userToken = data.userToken;

//   console.log(userToken);
//   if (!userToken) {
//     res.json({
//       error: true,
//     });
//     return;
//   }

//   login(data.email, data.password, userToken, (error, response, body) => {
//     console.log(body);
//     body = JSON.parse(body);
//     res.json({
//       token: body.access_token.token,
//     });
//   });
// };

// export let kyc = (req: Request, res: Response) => {
//   const userToken = req.query.user;

//   const payload = {
//     manual_override: false,
//     user_token: userToken,
//   };

//   request.post({
//     body: JSON.stringify(payload),
//     headers: {
//       "Accept": "application/json",
//       "Authorization": "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==",
//       "content-type": "application/json",
//     },
//     url: process.env.MARQETA + "kyc",
//   }, (error, response, body) => {
//     console.log(body);
//     body = JSON.parse(body);
//     res.json({
//       kyc_token: body.token,
//     });
//   });
// };
