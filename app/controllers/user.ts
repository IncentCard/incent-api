import { Request, Response } from "express";
import * as uuid from "uuid";
import { default as User } from "../models/User";

export let postSignUp = (req: Request, res: Response) => {
  // verify parameters

  // check token is valid (this returns an id for the user)

  const userId: string = uuid.v4();

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
