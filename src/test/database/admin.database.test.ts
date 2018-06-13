import bcrypt from "bcrypt";
import * as firebase from "firebase-admin";
import "jest";
import each from "jest-each";
import * as uuid from "uuid";
import DatabaseClient from "../../app/database/DatabaseClient";
import { Admin } from "../../app/models/Admin";

describe("Admin database Tests", () => {
    let database: DatabaseClient;

    beforeAll(() => {
        const firebaseAdmin = firebase.initializeApp({
            credential: firebase.credential.cert("./serviceAccountKey.json"),
            databaseURL: "https://incentcard.firebaseio.com",
          });
        database = new DatabaseClient(process.env.DATABASE_URL || "postgres://localhost:5432/test", 
            firebaseAdmin.firestore());
    });

    test("Admin add and get", () => {
        const admin: Admin = new Admin(uuid.v4(), "password");
        return database.addAdmin(admin)
            .then(() => {
                return database.getAdmin(admin.username)
                    .then((foundAdmin: Admin) => {
                        return expect(bcrypt.compareSync("password", foundAdmin.password)).toBeTruthy();
                    });
            });
    }, 1000);

    test("Admin add, update, then get", () => {
        const admin: Admin = new Admin(uuid.v4(), "password");
        return database.addAdmin(admin)
            .then(() => {
                return database.getAdmin(admin.username)
                    .then((foundAdmin: Admin) => {
                        foundAdmin.password = "password2";
                        return database.updateAdmin(foundAdmin)
                            .then(() => {
                                return database.getAdmin(admin.username)
                                    .then((foundAdmin2) => {
                                        return expect(bcrypt.compareSync("password2", foundAdmin2.password))
                                            .toBeTruthy();
                                    });
                            });
                    });
            });
    }, 1000);

    each([
        [null],
        [undefined],
    ]).test("Admin null add", (value: any) => {
        return expect(database.addAdmin(value)).rejects.toThrow("Admin must not be null");
    });

    each([
        [null],
        [undefined],
    ]).test("Admin null get", (value: any) => {
        return expect(database.getAdmin(value)).rejects.toThrow("Username must not be null");
    });

    each([
        [null],
        [undefined],
    ]).test("Admin null update", (value: any) => {
        return expect(database.updateAdmin(value)).rejects.toThrow("Admin must not be null");
    });

    test("Admin get for not found entry", () => {
        const username: string = uuid.v4();
        return expect(database.getAdmin(username)).rejects
            .toThrow("Couldn't find entry for username: " + username);
    });
});
