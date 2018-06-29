import "jest";
import each from "jest-each";
import WaitlistEntry from "../../app/models/WaitlistEntry";

describe("User tests", () => {
    test("full constructor", () => {
        const waitlistEntry: WaitlistEntry = new WaitlistEntry("bogus@incentcard.com", "Joe");
        expect(waitlistEntry.email).toBe("bogus@incentcard.com");
        expect(waitlistEntry.firstName).toBe("Joe");
    });

    each([
        [null],
        [undefined],
        [""],
    ]).test("bad email constructor", () => {
        const email: string = null;
        expect(() => new WaitlistEntry(email, "Joe")).toThrow("You must provide an email");
    });

    each([
        [null],
        [undefined],
        [""],
    ]).test("bad firstName constructor", (firstName: string) => {
        expect(() => new WaitlistEntry("bogus@incentcard.com", firstName)).toThrow("You must provide firstName");
    });

    test("update all fields", () => {
        const waitlistEntry: WaitlistEntry = new WaitlistEntry("bogus@incentcard.com", "Joe");

        waitlistEntry.email = "real@incentcard.com";
        waitlistEntry.firstName = "Chad";

        expect(waitlistEntry.email).toBe("real@incentcard.com");
        expect(waitlistEntry.firstName).toBe("Chad");
    });

    each([
        [null],
        [undefined],
        [""],
    ]).test("update fields to illegal values", (value: string) => {
        const waitlistEntry: WaitlistEntry = new WaitlistEntry("bogus@incentcard.com", "Joe");

        expect(() => waitlistEntry.email = value).toThrow("You must provide an email");
        expect(() => waitlistEntry.firstName = value).toThrow("You must provide firstName");
    });
});
