import bcrypt from "bcrypt";
import pg from "pg";
import { serviceLog } from "../configLog4j";
import { Admin } from "../models/Admin";
import { User } from "../models/User";
import { DatabaseError } from "./DatabaseError";

class DatabaseClient {
    private pool: pg.Pool;

    public constructor(connectionString: string) {
        this.pool = new pg.Pool({
            connectionString,
        });
    }

    public addUser(user: User): Promise<void> {
        if (!user) {
            return Promise.reject(new Error("User must not be null"));
        }
        if (!user.id) {
            return Promise.reject(new Error("User ID must be provided"));
        }

        return this.pool.query("INSERT INTO users(id, data) values($1, $2)", [user.id, user.stringify()])
            .then(() => {
                serviceLog.debug(`Added user ${user.id} to database`);
            })
            .catch((err: Error) => {
                if (err.message.indexOf("duplicate") >= 0) {
                    return Promise.reject(new Error("Duplicate user ID or Token"));
                } else {
                    return Promise.reject(new Error("Failed to add entry to database"));
                }
            });
    }

    public updateUser(user: User): Promise<void> {
        if (!user) {
            return Promise.reject(new Error("User must not be null"));
        }
        if (!user.id) {
            return Promise.reject(new Error("User ID must be provided"));
        }

        return this.pool.connect()
            .then((client) => {
                return client.query("UPDATE users SET data = $1 WHERE id = $2", [user.stringify(), user.id])
                    .then((res) => {
                        client.release();
                    });
            })
            .catch((err) => {
                return Promise.reject(new Error("Failed to update entry in database"));
            });
    }

    public getUser(id: string): Promise<User> {
        if (!id) {
            return Promise.reject(new Error("ID must not be null"));
        }

        return this.pool.connect()
            .then((client) => {
                return client.query("SELECT data FROM users WHERE id = $1",
                    [id]).then((res): Promise<User> => {
                        client.release();
                        const data = res.rows[0];
                        return Promise.resolve(new User(data.data));
                    });
            })
            .catch((err) => {
                return Promise.reject(new Error("Failed to get entry from database"));
            });
    }

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
                                    .then((res) => {
                                        return client.release();
                                    });
                            });
                    });
            })
            .catch((err) => {
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
                                    .then((res) => {
                                        return client.release();
                                    });
                            });
                    });
            })
            .catch((err) => {
                return Promise.reject(new Error("Failed to update entry in database"));
            });

    }
}

export default DatabaseClient;
