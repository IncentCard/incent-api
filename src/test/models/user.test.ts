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
        favoriteFood: "Pizza",
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

    const nonMarqetaFields: string[] = ["favoriteFood"];

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
            if (nonMarqetaFields.includes(field)) {
                expect(user[field]).toBeUndefined();
            } else {
                expect(user[field]).toEqual(sampleJson[field]);
            }
        }
    });

    test("Verify null constructor", () => {
        expect(() => new User(null)).toThrow("You must provide an ID or Token");
    });

    test("Verify undefined constructor", () => {
        expect(() => new User(undefined)).toThrow("You must provide an ID or Token");
    });

    test("Verify null ID constructor", () => {
        expect(() => new User({id: null})).toThrow("ID can't be set to null, undefined, or empty string");
    });

    test("Verify undefined ID constructor", () => {
        expect(() => new User({id: undefined})).toThrow("ID can't be set to null, undefined, or empty string");
    });

    test("Verify empty ID constructor", () => {
        expect(() => new User({id: ""})).toThrow("ID can't be set to null, undefined, or empty string");
    });

    test("Verify null token constructor", () => {
        expect(() => new User({token: null})).toThrow("ID can't be set to null, undefined, or empty string");
    });

    test("Verify undefined token constructor", () => {
        expect(() => new User({token: undefined})).toThrow("ID can't be set to null, undefined, or empty string");
    });

    test("Verify empty token constructor", () => {
        expect(() => new User({token: ""})).toThrow("ID can't be set to null, undefined, or empty string");
    });

    test("Verify update to all fields", () => {
        const user: User = new User(sampleJson);

        for (const field in sampleJson) {
            user[field] = "updated";
            expect(user[field]).toEqual("updated");
        }
    });

    test("Verify update to all fields with illegal values", () => {
        const user: User = new User(sampleJson);

        expect(() => user.id = null).toThrow("ID can't be set to null, undefined, or empty string");
        expect(() => user.id = undefined).toThrow("ID can't be set to null, undefined, or empty string");
        expect(() => user.id = "").toThrow("ID can't be set to null, undefined, or empty string");
    });

    test("Verify convertToJSON", () => {
        const user: User = new User(sampleJson);

        const json = user.convertToJSON();
        expect(json instanceof User).toBeFalsy();
        expect(JSON.stringify(json));
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
