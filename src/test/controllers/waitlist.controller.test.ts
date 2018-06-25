import { Server } from "http";
import "jest";
import request from "supertest";
import * as uuid from "uuid";
import app from "../../app/app";
import { mockAddWaitList, mockGetPermissions } from "../../app/database/__mocks__/DatabaseClient";
import { Permission } from "../../app/models/Permission";
import * as utilities from "../utilities";

// Mocks the DatabaseClient and allows for modifications of mock implementations directly
jest.mock("../../app/database/DatabaseClient", () => {
    // tslint:disable-next-line:only-arrow-functions
    return function() {
        return require("../../app/database/__mocks__/DatabaseClient").mock;
    };
});

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

    test("waitlist with no permissions", (done) => {
        mockGetPermissions.mockImplementationOnce((): Promise<Permission> => {
            return Promise.resolve({});
        });
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
                    expect(mockAddWaitList).toHaveBeenCalledWith("test@incentcard.com", "Joe", lastName);
                    done();
                });
        });
    });

    test("waitlist add duplicate", (done) => {
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
                    expect(mockAddWaitList).toHaveBeenCalledWith("test@incentcard.com", "Joe", lastName);
                    done();
                });
        });
    });
});
