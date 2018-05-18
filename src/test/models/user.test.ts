import "jest";
import each from "jest-each";
import * as uuid from "uuid";
import { MarqetaUser } from "../../app/models/MarqetaUser";
import { User } from "../../app/models/User";

// tslint:disable:forin

describe("User tests", () => {
    /**
     * this is a sample JSON object that can be used in tests.
     * It adheres to the interface IUser without implementing it.
     * It should be a field for field clone of the 'sampleMarqeta' object except
     * the naming convention is that of IUser.
     * DO NOT MODIFY unless you understand the consequences. Copy instead.
     */
    const sampleJson = {
        address1: "1 Arizona Memorial Place",
        birthDate: "1941-12-7",
        city: "Honolulu",
        country: "USA",
        firstName: "Perl",
        id: "BB-39",
        lastName: "Harbor",
        ssn: "123456789",
        state: "HI",
        zip: "96818",
    };

    /**
     * this is a sample MarqetaUser JSON object that can be used in tests.
     * It should be a field for field clone of the 'sampleJson' object except
     * the naming convention is that of MarqetaUser.
     * DO NOT MODIFY unless you understand the consequences. Copy instead.
     */
    const sampleMarqeta: MarqetaUser = {
        address1: "1 Arizona Memorial Place",
        birth_date: "1941-12-7",
        city: "Honolulu",
        country: "USA",
        first_name: "Perl",
        last_name: "Harbor",
        ssn: "123456789",
        state: "HI",
        token: "BB-39",
        zip: "96818",
    };

    test("Verify minimum arguments", () => {
        const user: User = new User({ id: sampleJson.id });

        for (const field in sampleJson) {
            if (field === "id") {
                expect(user[field]).toEqual(sampleJson[field]);
            } else {
                expect(user[field]).toBeUndefined();
            }
        }
    });

    test("Verify minimum arguments Marqeta", () => {
        const user: User = new User({ token: sampleMarqeta.token });

        for (const field in sampleJson) {
            if (field === "id") {
                expect(user[field]).toEqual(sampleMarqeta.token);
            } else {
                expect(user[field]).toBeUndefined();
            }
        }
    });
    test("Verify constructor with all fields", () => {
        const user: User = new User(sampleJson);

        for (const field in sampleJson) {
            expect(user[field]).toEqual(sampleJson[field]);
        }
    });

    test("Verify constructor with all fields and MarqetaUser", () => {
        const user: User = new User(sampleMarqeta);

        for (const field in sampleJson) {
            expect(user[field]).toEqual(sampleJson[field]);
        }
    });

    test("Verify null constructor", () => {
        expect(() => new User(null)).toThrow("You must provide an ID or Token");
    });

    test("Verify undefined constructor", () => {
        expect(() => new User(null)).toThrow("You must provide an ID or Token");
    });

    test("Verify convertToJSON", () => {
        const user: User = new User(sampleJson);

        const json = user.convertToJSON();
        expect(json instanceof User).toBeFalsy();
        for (const field in sampleJson) {
            expect(json[field]).toEqual(sampleJson[field]);
        }
    });

    test("Verify stringify", () => {
        const user: User = new User(sampleJson);

        const flattened: string = user.stringify();
        const inflated = JSON.parse(flattened);
        for (const field in sampleJson) {
            expect(inflated[field]).toEqual(sampleJson[field]);
        }
    });
});
