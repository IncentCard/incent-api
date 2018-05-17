import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { addAdmin, getAdmin } from "../database";
import { Admin } from "../models/Admin";

export let postAdmin = (req: Request, res: Response) => {
    // verify parameters
    // todo: verify all headers are present for JSON data
    const data = req.body;
    const admin: Admin = new Admin(data.username, data.password, data.permission);
    addAdmin(admin);
    res.sendStatus(201);
};

// todo: admin put endpoint

// todo: admin delete endpoint

// todo: implement this for real
export let login = (req: Request, res: Response) => {
    // verify parameters
    // todo: verify all headers are present for JSON data
    const data = req.body;
    getAdmin(data.username, (admin: Admin) => {
        if (bcrypt.compareSync(data.password, admin.password)) {
            res.json(JSON.stringify(admin));
        } else {
            res.sendStatus(403);
        }
    });
};
