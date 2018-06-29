import { WriteResult } from "@google-cloud/firestore";
import * as uuid from "uuid";
import { Permission } from "../../models/Permission";
import { User } from "../../models/User";
import WaitlistEntry from "../../models/WaitlistEntry";

export const mockAddUser = jest.fn().mockImplementation(
    (user: User): Promise<void> => {
        return null;
    });

export const mockUpdateUser = jest.fn().mockImplementation(
    (user: User): Promise<void> => {
        return null;
    });

export const mockGetUser = jest.fn().mockImplementation(
    (id: string): Promise<User> => {
        return Promise.resolve(new User(
            { id: uuid.v4(), firstName: "test", lastName: "mock" },
        ));
    });

export const mockAddWaitListEntry = jest.fn().mockImplementation(
    (waitlistEntry: WaitlistEntry): Promise<WriteResult> => {
        return Promise.resolve(undefined);
    });

export const mockGetPermissions = jest.fn().mockImplementation(
    (uid: string): Promise<Permission> => {
        return Promise.resolve({
            waitlist: "*",
        });
    });

export const mock = {
    addUser: mockAddUser,
    addWaitListEntry: mockAddWaitListEntry,
    getPermissions: mockGetPermissions,
    getUser: mockGetUser,
    updateUser: mockUpdateUser,
};

export default jest.fn().mockImplementation(() => {
    return mock;
});
