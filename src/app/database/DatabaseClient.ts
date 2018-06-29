import { WriteResult, DocumentData } from "@google-cloud/firestore";
import bcrypt from "bcrypt";
import pg from "pg";
import { Logger } from "typescript-logging";
import { logFactory } from "../configLog4j";
import { Admin } from "../models/Admin";
import { Permission } from "../models/Permission";
import { User } from "../models/User";
import { DatabaseError } from "./DatabaseError";
import MarqetaClient from "./MarqetaClient";
import WaitlistEntry from "../models/WaitlistEntry";

export default class DatabaseClient {
    private pool: pg.Pool;
    private firestore: FirebaseFirestore.Firestore;
    private marqetaClient: MarqetaClient;
    private logger: Logger = logFactory.getLogger("database");

    public constructor(connectionString: string, firestore: FirebaseFirestore.Firestore, marqetaClient: MarqetaClient) {
        this.firestore = firestore;
        this.pool = new pg.Pool({
            connectionString,
        });
        this.marqetaClient = marqetaClient;
    }

    public addUser(user: User): Promise<void> {
        if (!user) {
            return Promise.reject(new Error("User must not be null"));
        }
        if (!user.id) {
            return Promise.reject(new Error("User ID must be provided"));
        }

        const time = Date.now();
        return this.marqetaClient.addUser(user)
            .then((response) => {
                this.logger.debug("User data returned from marqeta: " + JSON.stringify(response.data));
                this.logger.debug("Marqeta request took: " + ((Date.now() - time) / 1000) + " seconds.");
                // add response to database
                const createdUser: User = new User(response.data);
                user.merge(createdUser);
                return this.pool.query("INSERT INTO users(id, data) values($1, $2)", [user.id, user.stringify(true)])
                    .then(() => {
                        this.logger.debug(`Added user ${user.id} to database`);
                    })
                    .catch((err: Error) => {
                        if (err.message.includes("duplicate")) {
                            return Promise.reject(new Error("Duplicate user ID or Token"));
                        } else {
                            return Promise.reject(new Error("Failed to add entry to database"));
                        }
                    });
            })
            .catch((err: Error) => {
                if (err.message.includes("Request failed with status code 409")) {
                    return Promise.reject(new Error("Duplicate user ID or Token"));
                }

                this.logger.error(err.message);
                return Promise.reject(err);
            });
    }

    public updateUser(user: User): Promise<void> {
        if (!user) {
            return Promise.reject(new Error("User must not be null"));
        }
        if (!user.id) {
            return Promise.reject(new Error("User ID must be provided"));
        }

        return this.marqetaClient.updateUser(user)
            .then((response) => {
                this.logger.debug("Updated marqeta user: " + response.data);
                return this.pool.query("UPDATE users SET data = $1 WHERE id = $2", [user.stringify(true), user.id])
                    .then(() => {
                        return Promise.resolve();
                    })
                    .catch(() => {
                        return Promise.reject(new Error("Failed to update entry in database"));
                    });
            });
    }

    public getUser(id: string): Promise<User> {
        if (!id) {
            return Promise.reject(new Error("ID must not be null"));
        }

        return this.marqetaClient.getUser(id)
            .then((response) => {
                const user: User = new User(response.data);
                return this.pool.query("SELECT data FROM users WHERE id = $1",
                    [id]).then((res): Promise<User> => {
                        const data = res.rows[0];
                        user.merge(new User(data.data));
                        return Promise.resolve(user);
                    })
                    .catch(() => {
                        return Promise.reject(new Error("Failed to get entry from database"));
                    });
            });
    }

    public addWaitListEntry(entry: WaitlistEntry): Promise<WriteResult> {
        if (!entry) {
            return Promise.reject(new DatabaseError("Valid entry must be provided"));
        }
        return this.firestore.collection("waitlist").doc(entry.email).get()
            .then((data) => {
                if (data.exists) {
                    return Promise.reject(new DatabaseError("Entry for email already exists"));
                } else {
                    return this.firestore.collection("waitlist").doc(entry.email).set({
                        email: entry.email,
                        firstName: entry.firstName,
                    });
                }
            });
    }

    public updateWaitListEntry(entry: WaitlistEntry): Promise<WriteResult> {
        if (!entry) {
            return Promise.reject(new DatabaseError("Valid entry must be provided"));
        }
        return this.firestore.collection("waitlist").doc(entry.email).set({
            email: entry.email,
            firstName: entry.firstName,
        });
    }

    public getWaitListEntry(email: string): Promise<WaitlistEntry> {
        if (!email) {
            return Promise.reject(new DatabaseError("Valid email must be provided"));
        }
        return this.firestore.collection("waitlist").doc(email).get()
            .then((doc) => {
                if (doc.exists) {
                    const data: DocumentData = doc.data();
                    this.logger.debug(`Retrieved waitlist entry for email: ${email}. \n${data}`);
                    return Promise.resolve(new WaitlistEntry(data.email, data.firstName));
                } else {
                    return Promise.reject(new DatabaseError("Failed to retrieve WaitlistEntry with email: " + email));
                }
            })
            .catch((err) => {
                this.logger.error("Failed to retrieve waitlist entry for email: " + email);
                return Promise.reject(err);
            });
    }

    public getPermissions(uid: string): Promise<Permission> {
        return this.firestore.collection("permissions").doc(uid).get()
            .then((doc) => {
                if (!doc.exists) {
                    return {};
                } else {
                    let data: Permission = {};
                    try {
                        data = doc.data();
                    } catch (err) {
                        this.logger.error(err);
                        return {};
                    }
                    return data;
                }
            });
    }

    /////// BELOW HERE IS DEPRECATED //////

    // tslint:disable:jsdoc-format
    /** @deprecated
    public addAdmin(admin: Admin): Promise<void> {
        if (!admin) {
            return Promise.reject(new Error("Admin must not be null"));
        }

        return this.pool.connect()
            .then((client) => {
                return bcrypt.genSalt(10)
                    .then((salt) => {
                        return bcrypt.hash(admin.password, salt)
                            .then((hash) => {
                                return client.query("INSERT INTO admins(username, password) values($1, $2)",
                                    [admin.username, hash])
                                    .then(() => {
                                        return client.release();
                                    });
                            });
                    });
            })
            .catch(() => {
                return Promise.reject(new Error("Failed to add entry to database"));
            });

    }

    public getAdmin(username: string): Promise<Admin> {
        if (!username) {
            return Promise.reject(new Error("Username must not be null"));
        }

        return this.pool.connect()
            .then((client) => {
                return client.query("SELECT username, password FROM admins WHERE username = $1",
                    [username]).then((res): Promise<Admin> => {
                        client.release();
                        const data = res.rows[0];
                        if (!data) {
                            return Promise.reject(new DatabaseError("Couldn't find entry for username: " + username));
                        } else {
                            return Promise.resolve(new Admin(data.username, data.password));
                        }
                    });
            })
            .catch((err) => {
                if (err instanceof DatabaseError) {
                    return Promise.reject(err);
                } else {
                    return Promise.reject(new Error("Failed to get entry from database"));
                }
            });
    }

    public updateAdmin(admin: Admin): Promise<void> {
        if (!admin) {
            return Promise.reject(new Error("Admin must not be null"));
        }

        return this.pool.connect()
            .then((client) => {
                return bcrypt.genSalt(10)
                    .then((salt) => {
                        return bcrypt.hash(admin.password, salt)
                            .then((hash) => {
                                return client.query("UPDATE admins SET password = $1 WHERE username = $2",
                                    [hash, admin.username])
                                    .then(() => {
                                        return client.release();
                                    });
                            });
                    });
            })
            .catch(() => {
                return Promise.reject(new Error("Failed to update entry in database"));
            });

    }
    */
}
