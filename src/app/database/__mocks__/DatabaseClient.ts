import { WriteResult } from "@google-cloud/firestore";
import * as uuid from "uuid";
import { User } from "../../models/User";
import { Permission } from "../../models/Permission";

export default class DatabaseClient {
    public addWaitlistCount = 0;

    public constructor(connectionString: string, firestore: FirebaseFirestore.Firestore) {
        console.debug("Mocking DatabaseClient");
    }

    public addUser(user: User): Promise<void> {
        return null;
    }

    public updateUser(user: User): Promise<void> {
        return null;
    }

    public getUser(id: string): Promise<User> {
        return Promise.resolve(new User(
            { id: uuid.v4(), firstName: "test", lastName: "mock" },
        ));
    }

    public addWaitList(email: string, firstName: string, lastName: string): Promise<WriteResult> {
        this.addWaitlistCount++;
        return Promise.resolve(null);
    }

    public getPermissions(uid: string): Promise<Permission> {
        return Promise.resolve({
            waitlist: "*",
        });
    }
}

// export const mockAddWaitList = jest.fn().mockImplementation(
//     (email: string, firstName: string, lastName: string): Promise<WriteResult> => {
//         this.addWaitlistCount++;
//         return Promise.resolve(null);
//     });

// export const mockGetPermissions = jest.fn().mockImplementation(
//     (uid: string): Promise<Permission> => {
//         return Promise.resolve({
//             waitlist: "*",
//         });
//     });

// const mock = jest.fn().mockImplementation(() => {
//     return {
//         addWaitList: mockAddWaitList,
//         getPermissions: mockGetPermissions,
//     };
// });
// export default mock;
