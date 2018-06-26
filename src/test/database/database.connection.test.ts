import * as firebase from "firebase-admin";
import "jest";
import * as uuid from "uuid";
import DatabaseClient from "../../app/database/DatabaseClient";
import MarqetaClient from "../../app/database/MarqetaClient";
import { Admin } from "../../app/models/Admin";
import { User } from "../../app/models/User";

jest.mock("../../app/database/MarqetaClient");

describe("Database Connection Tests", () => {
    let database: DatabaseClient;

    beforeAll(() => {
        const firebaseAdmin = firebase.initializeApp({
            credential: firebase.credential.cert("./serviceAccountKey.json"),
            databaseURL: "https://incentcard.firebaseio.com",
          });
        database = new DatabaseClient(
            "postgres://localhost:5432/bogus",
            firebaseAdmin.firestore(),
            new MarqetaClient());
    });

    test("User add with bogus database url", () => {
        const user: User = new User({id: uuid.v4()});
        return expect(database.addUser(user)).rejects.toThrow("Failed to add entry to database");
    });

    test("User update bogus database url", () => {
        const user: User = new User({id: uuid.v4()});
        return expect(database.updateUser(user)).rejects.toThrow("Failed to update entry in database");
    });

    test("User get bogus database url", () => {
        return expect(database.getUser(uuid.v4())).rejects.toThrow("Failed to get entry from database");
    });

    // tslint:disable:jsdoc-format
    /** @deprecated
    test("Admin add with bogus database url", () => {
        const admin: Admin = new Admin(uuid.v4(), "password");
        return expect(database.addAdmin(admin)).rejects.toThrow("Failed to add entry to database");
    });

    test("Admin update with bogus database url", () => {
        const admin: Admin = new Admin(uuid.v4(), "password");
        return expect(database.updateAdmin(admin)).rejects.toThrow("Failed to update entry in database");
    });

    test("Admin get with bogus database url", () => {
        return expect(database.getAdmin(uuid.v4())).rejects.toThrow("Failed to get entry from database");
    });
    */
});
