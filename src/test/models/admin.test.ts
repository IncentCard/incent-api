import "jest";
import each from "jest-each";
import * as uuid from "uuid";
import { Admin } from "../../app/models/Admin";

describe("Admin model tests", () => {

    test("Admin minimum constructor", () => {
        const admin: Admin = new Admin("admin", "password");

        expect(admin.username).toBe("admin");
        expect(admin.password).toBe("password");
    });

    test("Admin all fields constructor", () => {
        const admin: Admin = new Admin("admin", "password");

        expect(admin.username).toBe("admin");
        expect(admin.password).toBe("password");
    });

    test("Admin update all fields", () => {
        const admin: Admin = new Admin("admin", "password");

        expect(admin.username).toBe("admin");
        expect(admin.password).toBe("password");

        admin.username = "admin2";
        admin.password = "password2";

        expect(admin.username).toBe("admin2");
        expect(admin.password).toBe("password2");
    });

    test("Admin update all fields to bad values", () => {
        const admin: Admin = new Admin("admin", "password");

        expect(() => admin.username = null).toThrow("Username is required");
        expect(() => admin.username = undefined).toThrow("Username is required");
        expect(() => admin.username = "").toThrow("Username is required");
        expect(() => admin.password = null).toThrow("Password is required and can't be empty");
        expect(() => admin.password = undefined).toThrow("Password is required and can't be empty");
        expect(() => admin.password = "").toThrow("Password is required and can't be empty");

    });

    test("Admin null username", () => {
        return expect(() => new Admin(null, "password")).toThrow("Username is required");
    });

    test("Admin undefined username", () => {
        return expect(() => new Admin(undefined, "password")).toThrow("Username is required");
    });

    test("Admin empty username", () => {
        return expect(() => new Admin("", "password")).toThrow("Username is required");
    });

    test("Admin null password", () => {
        return expect(() => new Admin("admin", null)).toThrow("Password is required and can't be empty");
    });

    test("Admin undefined password", () => {
        return expect(() => new Admin("admin", undefined)).toThrow("Password is required and can't be empty");
    });

    test("Admin empty password", () => {
        return expect(() => new Admin("admin", "")).toThrow("Password is required and can't be empty");
    });
});
