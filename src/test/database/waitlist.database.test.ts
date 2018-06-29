import * as firebase from "firebase-admin";
import "jest";
import each from "jest-each";
import * as uuid from "uuid";
import * as config from "../../app/config";
import DatabaseClient from "../../app/database/DatabaseClient";
import MarqetaClient from "../../app/database/MarqetaClient";
import WaitlistEntry from "../../app/models/WaitlistEntry";

describe("User database Tests", () => {
    let database: DatabaseClient;
    let firebaseAdmin: firebase.app.App;
    let testId: string;
    const emails: string[] = [];

    beforeAll(() => {
        firebaseAdmin = firebase.initializeApp({
            credential: firebase.credential.cert("./serviceAccountKey.json"),
            databaseURL: "https://incentcard.firebaseio.com",
        });
        database = new DatabaseClient(config.databaseUrl,
            firebaseAdmin.firestore(),
            new MarqetaClient());
    });

    beforeEach(() => {
        testId = uuid.v4();
    });

    afterEach(() => {
        if (emails.length <= 0) {
            return;
        }

        const promises = [];
        emails.every((value: string, index: number, array: string[]): boolean => {
            promises.push(firebaseAdmin.firestore().collection("waitlist").doc(value).delete());
            return true;
        });
        return Promise.all(promises).then(() => {
            console.log("Finished deleting");
        });
    });

    test("add and get waitlist entry", () => {
        const email: string = testId + "@test.incentcard.com";
        emails.push(email);
        const waitlistEntry: WaitlistEntry = new WaitlistEntry(email, testId);
        return database.addWaitListEntry(waitlistEntry)
            .then(() => {
                return database.getWaitListEntry(email)
                    .then((entry) => {
                        return expect(entry.firstName).toBe(testId);
                    });
            });
    });

    test("add, update, and get waitlist entry", () => {
        const email: string = testId + "@test.incentcard.com";
        emails.push(email);
        const waitlistEntry: WaitlistEntry = new WaitlistEntry(email, testId);
        return database.addWaitListEntry(waitlistEntry)
        .then(() => {
            waitlistEntry.firstName = "updated-" + testId;
            return database.updateWaitListEntry(waitlistEntry)
                .then(() => {
                    return database.getWaitListEntry(email)
                        .then((entry) => {
                            return expect(entry.firstName).toBe("updated-" + testId);
                        });
                });
        });
    });

    test("add duplicate waitlist entry", () => {
        const email: string = testId + "@test.incentcard.com";
        emails.push(email);
        const waitlistEntry: WaitlistEntry = new WaitlistEntry(email, testId);
        return database.addWaitListEntry(waitlistEntry)
        .then(() => {
            return expect(database.addWaitListEntry(waitlistEntry)).rejects.toThrow("Entry for email already exists");
        });
    });

    each([
        [null],
        [undefined],
    ]).test("add bad waitlist entry", (value) => {
        return expect(database.addWaitListEntry(value)).rejects.toThrow("Valid entry must be provided");
    });

    each([
        [null],
        [undefined],
    ]).test("update bad waitlist entry", (value) => {
        return expect(database.updateWaitListEntry(value)).rejects.toThrow("Valid entry must be provided");
    });

    each([
        [null],
        [undefined],
    ]).test("get bad waitlist entry", (value) => {
        return expect(database.getWaitListEntry(value)).rejects.toThrow("Valid email must be provided");
    });
});
