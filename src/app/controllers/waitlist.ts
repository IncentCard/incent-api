import { WriteResult } from "@google-cloud/firestore";
import { Request, Response } from "express";
import { database } from "../app";
import WaitlistEntry from "../models/WaitlistEntry";
import { DatabaseError } from "../database/DatabaseError";

interface PostWaitListPayload {
    email: string;
    firstName: string;
    lastName: string;
}

export let postWaitList = (req: Request, res: Response) => {
    const data: PostWaitListPayload = req.body;
    const entry: WaitlistEntry = new WaitlistEntry(data.email, data.firstName);
    database.addWaitListEntry(entry)
        .then((result: WriteResult) => {
            res.sendStatus(201);
        })
        .catch((err: DatabaseError) => {
            res.status(422);
            res.send(err.message);
        });
};

export let putWaitList = (req: Request, res: Response) => {
    // todo: implement
    res.sendStatus(501);
};

export let getWaitList = (req: Request, res: Response) => {
    // todo: implement
    res.sendStatus(501);
};
