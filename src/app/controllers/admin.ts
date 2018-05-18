import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { database } from "../app";
import { Admin } from "../models/Admin";

export let postAdmin = (req: Request, res: Response) => {
    // verify parameters
    // todo: verify all headers are present for JSON data
    const data = req.body;
    const admin: Admin = new Admin(data.username, data.password, data.permission);
    database.addAdmin(admin);
    res.sendStatus(201);
};

// todo: admin put endpoint

// todo: admin delete endpoint

// todo: implement this for real
export let login = (req: Request, res: Response) => {
    // verify parameters
    // todo: verify all headers are present for JSON data
    const data = req.body;
    database.getAdmin(data.username).then((admin: Admin) => {
        if (bcrypt.compareSync(data.password, admin.password)) {
            res.json(JSON.stringify(admin));
        } else {
            res.sendStatus(403);
        }
    });
};
