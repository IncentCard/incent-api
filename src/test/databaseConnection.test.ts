import "jest";
import each from "jest-each";
import * as uuid from "uuid";
import DatabaseClient from "../app/DatabaseClient";
import { User } from "../app/models/User";

describe("Database Connection Tests", () => {
    let database: DatabaseClient;

    beforeAll(() => {
        database = new DatabaseClient("postgres://localhost:5432/bogus");
    });

    test("User add with bogus database url", () => {
        const user: User = new User();
        user.id = uuid.v4();
        return expect(database.addUser(user)).rejects.toThrow("Failed to add entry to database");
    });
});
