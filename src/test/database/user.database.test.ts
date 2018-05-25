import "jest";
import each from "jest-each";
import * as uuid from "uuid";
import DatabaseClient from "../../app/database/DatabaseClient";
import { User } from "../../app/models/User";

describe("User database Tests", () => {
    let database: DatabaseClient;

    beforeAll(() => {
        database = new DatabaseClient(process.env.DATABASE_URL || "postgres://localhost:5432/test");
    });

    test("User add and get", () => {
        const user: User = new User({id: uuid.v4()});
        user.firstName = "Joe";
        return database.addUser(user)
            .then(() => {
                return database.getUser(user.id)
                    .then((foundUser: User) => {
                        return expect(foundUser.firstName).toBe(user.firstName);
                    });
            });
    }, 1000);

    test("User add, update, then get", () => {
        const user: User = new User({id: uuid.v4()});
        user.firstName = "Joe";
        return database.addUser(user)
            .then(() => {
                return database.getUser(user.id)
                    .then((foundUser: User) => {
                        foundUser.firstName = "Pete";
                        return database.updateUser(foundUser)
                            .then(() => {
                                return database.getUser(foundUser.id)
                                    .then((secondFoundUser) => {
                                        expect(secondFoundUser.firstName).toBe("Pete");
                                    });
                            });
                    });
            });
    }, 1000);

    test("User add and add again as duplicate", () => {
        const user: User = new User({id: uuid.v4()});
        user.firstName = "Joe";
        return database.addUser(user)
            .then(() => {
                user.firstName = "Chad";
                return expect(database.addUser(user)).rejects.toThrow("Duplicate user ID or Token");
            });
    }, 1000);

    test("User null add", () => {
        return expect(database.addUser(null)).rejects.toThrow("User must not be null");
    });

    test("User undefined add", () => {
        return expect(database.addUser(undefined)).rejects.toThrow("User must not be null");
    });

    test("User null get", () => {
        return expect(database.getUser(null)).rejects.toThrow("ID must not be null");
    });

    test("User undefined get", () => {
        return expect(database.getUser(undefined)).rejects.toThrow("ID must not be null");
    });

    test("User empty get", () => {
        return expect(database.getUser("")).rejects.toThrow("ID must not be null");
    });

    test("User null update", () => {
        return expect(database.updateUser(null)).rejects.toThrow("User must not be null");
    });

    test("User undefined update", () => {
        return expect(database.updateUser(undefined)).rejects.toThrow("User must not be null");
    });
});
