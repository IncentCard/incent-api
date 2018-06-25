import { WriteResult } from "@google-cloud/firestore";
import * as uuid from "uuid";
import { Permission } from "../../models/Permission";
import { User } from "../../models/User";

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

export const mockAddWaitList = jest.fn().mockImplementation(
    (email: string, firstName: string, lastName: string): Promise<WriteResult> => {
        this.addWaitlistCount++;
        return Promise.resolve(null);
    });

export const mockGetPermissions = jest.fn().mockImplementation(
    (uid: string): Promise<Permission> => {
        return Promise.resolve({
            waitlist: "*",
        });
    });

export const mock = {
    addWaitList: mockAddWaitList,
    getPermissions: mockGetPermissions,
};

export default jest.fn().mockImplementation(() => {
    return {
        addUser: mockAddUser,
        addWaitList: mockAddWaitList,
        getPermissions: mockGetPermissions,
        getUser: mockGetUser,
        updateUser: mockUpdateUser,
    };
});
