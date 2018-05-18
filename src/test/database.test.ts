import "jest";
import each from "jest-each";
import * as uuid from "uuid";
import DatabaseClient from "../app/DatabaseClient";
import { User } from "../app/models/User";

describe("Database Tests", () => {
    let database: DatabaseClient;

    beforeAll(() => {
        database = new DatabaseClient(process.env.DATABASE_URL || "postgres://localhost:5432/test");
    });

    test("User add and get", async () => {
        const user: User = new User();
        user.firstName = "Joe";
        user.id = uuid.v4();
        await database.addUser(user)
            .then(async () => {
                await database.getUser(user.id)
                    .then((foundUser: User) => {
                        expect(foundUser.firstName).toBe(user.firstName);
                    });
            });
    }, 1000);

    test("User add, update, then get", async () => {
        const user: User = new User();
        user.firstName = "Joe";
        user.id = uuid.v4();
        await database.addUser(user)
            .then(async () => {
                await database.getUser(user.id)
                    .then(async (foundUser: User) => {
                        foundUser.firstName = "Pete";
                        await database.updateUser(foundUser)
                            .then(async () => {
                                await database.getUser(foundUser.id)
                                    .then((secondFoundUser) => {
                                        expect(secondFoundUser.firstName).toBe("Pete");
                                    });
                            });
                    });
            });
    }, 1000);

    each([
        [null],
        [undefined],
    ]).test("User null add", (value: any) => {
        return expect(database.addUser(value)).rejects.toThrow("User must not be null");
    });

    test("User add with no ID", () => {
        const user: User = new User();
        return expect(database.addUser(user)).rejects.toThrow("User ID must be provided");
    });
});
