import { WriteResult } from "@google-cloud/firestore";
import { Request, Response } from "express";
import { database } from "../app";

interface PostWaitListPayload {
    email: string;
    firstName: string;
    lastName: string;
}

export let postWaitList = (req: Request, res: Response) => {
    const data: PostWaitListPayload = req.body;
    database.addWaitList(data.email, data.firstName, data.lastName)
        .then((result: WriteResult) => {
            res.sendStatus(201);
        });
};
