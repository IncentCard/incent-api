import axios, { AxiosPromise } from "axios";
import * as functions from "firebase-functions";
import * as config from "../config";
import { MarqetaUser } from "../models/MarqetaUser";
import { User } from "../models/User";

export default class MarqetaClient {
    private marqeta: string;

    public constructor() {
        this.marqeta = config.marqetaUrl;
        if (!this.marqeta) {
            throw new Error("Can't find configuration for MARQETA");
        }
    }

    public addUser(user: User): AxiosPromise<any> {
        return axios.post(
            this.marqeta + "users",
            user.convertToMarqeta(),
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": this.getMarqetaAuth(),
                    "content-type": "application/json",
                },
            },
        );
    }

    public updateUser(user: User): AxiosPromise<any> {
        return axios.put(
            this.marqeta + "users/" + user.id,
            user.convertToMarqeta(),
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": this.getMarqetaAuth(),
                    "content-type": "application/json",
                },
            },
        );
    }

    public getUser(id: string): AxiosPromise<MarqetaUser> {
        return axios.get(
            this.marqeta + "users/" + id,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": this.getMarqetaAuth(),
                    "content-type": "application/json",
                },
            },
        );
    }

    public ping(): AxiosPromise<any> {
        return axios.get(
            this.marqeta + "ping",
            {
                headers: {
                    Accept: "application/json",
                    Authorization: this.getMarqetaAuth(),
                },
            });
    }

    // todo: make this do something more secure
    private getMarqetaAuth(): string {
        return "Basic dXNlcjI3NTgxNTE5MzQ0MDU2Ojg4OTAxMTViLTdiOGUtNDRiOC05Mjc0LWI2ZjRlMGQzZmFlZA==";
    }
}