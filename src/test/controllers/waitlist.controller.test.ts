import { Server } from "http";
import "jest";
import request from "supertest";
import * as uuid from "uuid";
import app from "../../app/app";
import * as appStuff from "../../app/app";
import * as utilities from "../utilities";

jest.mock("../../app/database/DatabaseClient");

describe("Waitlist endpoint tests", () => {
    let server: Server;

    beforeEach(() => {
        server = app.listen(app.get("port"));
    });

    afterEach(() => {
        server.close();
    });

    test("waitlist with no token", (done) => {
        request(server)
            .post("/waitlist")
            .set("Content-Type", "application/json")
            .send({
                email: "test@incentcard.com",
                firstName: "Joe",
                lastName: "Cracker",
            })
            .expect(401, done);
    });

    xtest("waitlist with no permissions", (done) => {
        // todo: figure out how to fix mock to return a different permission
        utilities.getIdToken(process.env.TEST_USERNAME, process.env.TEST_PASSWORD, (idToken: string) => {
            request(server)
                .post("/waitlist")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + idToken)
                .send({
                    email: "test@incentcard.com",
                    firstName: "Joe",
                    lastName: "Cracker",
                })
                .expect(403, done);
        });
    });

    test("waitlist add", (done) => {
        const spy = jest.spyOn(appStuff.database, "addWaitList");
        const lastName = uuid.v4();
        utilities.getIdToken(process.env.TEST_USERNAME, process.env.TEST_PASSWORD, (idToken: string) => {
            request(server)
                .post("/waitlist")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + idToken)
                .send({
                    email: "test@incentcard.com",
                    firstName: "Joe",
                    lastName,
                })
                .expect(201)
                .then(() => {
                    expect(spy).toHaveBeenCalledWith("test@incentcard.com", "Joe", lastName);
                    done();
                });
        });
    });

    test("waitlist add duplicate", (done) => {
        const spy = jest.spyOn(appStuff.database, "addWaitList");
        const lastName = uuid.v4();
        utilities.getIdToken(process.env.TEST_USERNAME, process.env.TEST_PASSWORD, (idToken: string) => {
            request(server)
                .post("/waitlist")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + idToken)
                .send({
                    email: "test@incentcard.com",
                    firstName: "Joe",
                    lastName,
                })
                .expect(201)
                .then(() => {
                    expect(spy).toHaveBeenCalledWith("test@incentcard.com", "Joe", lastName);
                    done();
                });
        });
    });
});
