import { WriteResult } from "@google-cloud/firestore";
import { Server } from "http";
import "jest";
import request from "supertest";
import * as uuid from "uuid";
import app from "../../app/app";
import * as config from "../../app/config";
import { mockAddWaitListEntry, mockGetPermissions } from "../../app/database/__mocks__/DatabaseClient";
import { DatabaseError } from "../../app/database/DatabaseError";
import { Permission } from "../../app/models/Permission";
import WaitlistEntry from "../../app/models/WaitlistEntry";
import * as utilities from "../utilities";

// Mocks the DatabaseClient and allows for modifications of mock implementations directly
jest.mock("../../app/database/DatabaseClient", () => {
    // NOTE: This cannot be an arrow function
    // tslint:disable-next-line:only-arrow-functions
    return function() {
        return require("../../app/database/__mocks__/DatabaseClient").mock;
    };
});

describe("Waitlist endpoint tests", () => {
    let server: Server;

    beforeAll(() => {
        server = app.listen(config.port);
    });

    afterAll(() => {
        server.close();
    });

    test("waitlist post with no token", (done) => {
        return request(server)
            .post("/waitlist")
            .set("Content-Type", "application/json")
            .send({
                email: "test@incentcard.com",
                firstName: "Joe",
                lastName: "Cracker",
            })
            .expect(401, done);
    });

    test("waitlist put with no token", (done) => {
        return request(server)
            .put("/waitlist")
            .set("Content-Type", "application/json")
            .send({
                email: "test@incentcard.com",
                firstName: "Joe",
                lastName: "Cracker",
            })
            .expect(401, done);
    });

    test("waitlist get with no token", (done) => {
        return request(server)
            .get("/waitlist/bogus")
            .set("Content-Type", "application/json")
            .expect(401, done);
    });

    test("waitlist post with no permissions", () => {
        mockGetPermissions.mockImplementationOnce((): Promise<Permission> => {
            return Promise.resolve({});
        });
        return utilities.getIdToken(process.env.TEST_USERNAME, process.env.TEST_PASSWORD)
        .then((idToken: string) => {
            return request(server)
                .post("/waitlist")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + idToken)
                .send({
                    email: "test@incentcard.com",
                    firstName: "Joe",
                    lastName: "Cracker",
                })
                .expect(403);
        });
    });

    test("waitlist put with no permissions", () => {
        mockGetPermissions.mockImplementationOnce((): Promise<Permission> => {
            return Promise.resolve({});
        });
        return utilities.getIdToken(process.env.TEST_USERNAME, process.env.TEST_PASSWORD)
        .then((idToken: string) => {
            return request(server)
                .put("/waitlist")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + idToken)
                .send({
                    email: "test@incentcard.com",
                    firstName: "Joe",
                    lastName: "Cracker",
                })
                .expect(403);
        });
    });

    test("waitlist get with no permissions", () => {
        mockGetPermissions.mockImplementationOnce((): Promise<Permission> => {
            return Promise.resolve({});
        });
        return utilities.getIdToken(process.env.TEST_USERNAME, process.env.TEST_PASSWORD)
        .then((idToken: string) => {
            return request(server)
                .get("/waitlist/bogus")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + idToken)
                .expect(403);
        });
    });

    test("waitlist add", () => {
        const expected: WaitlistEntry = new WaitlistEntry(uuid.v4() + "@incentcard.com", uuid.v4());
        return utilities.getIdToken(process.env.TEST_USERNAME, process.env.TEST_PASSWORD)
        .then((idToken: string) => {
            return request(server)
                .post("/waitlist")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + idToken)
                .send({
                    email: expected.email,
                    firstName: expected.firstName,
                })
                .expect(201)
                .then(() => {
                    return expect(mockAddWaitListEntry).toHaveBeenCalledWith(expected);
                });
        });
    });

    test("waitlist with duplicate", () => {
        mockAddWaitListEntry.mockImplementationOnce(
            (waitlistEntry: WaitlistEntry): Promise<WriteResult> => {
                return Promise.reject(new DatabaseError("Entry for email already exists"));
            });
        const expected: WaitlistEntry = new WaitlistEntry(uuid.v4() + "@incentcard.com", uuid.v4());
        return utilities.getIdToken(process.env.TEST_USERNAME, process.env.TEST_PASSWORD)
        .then((idToken: string) => {
            return request(server)
                .post("/waitlist")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer " + idToken)
                .send({
                    email: expected.email,
                    firstName: expected.firstName,
                })
                .expect(422, "Entry for email already exists");
        });
    });

    // todo: implement update tests

    // todo: implement get tests
});
