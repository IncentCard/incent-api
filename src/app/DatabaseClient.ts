import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import pg from "pg";
import { serviceLog } from "./configLog4j";
import { Admin } from "./models/Admin";
import { User } from "./models/User";

class DatabaseClient {
    private pool: pg.Pool;

    public constructor(connectionString: string) {
        this.pool = new pg.Pool({
            connectionString,
        });
    }

    public addUser(user: User): Promise<void> {
        // todo: sanity check the User
        if (!user) {
            return Promise.reject(new Error("User must not be null"));
        }
        if (!user.id) {
            return Promise.reject(new Error("User ID must be provided"));
        }

        return this.pool.query("INSERT INTO users(id, data) values($1, $2)", [user.id, user.stringify()])
            .then(() => {
                // todo: check query result worked?
                serviceLog.debug(`Added user ${user.id} to database`);
            })
            .catch((err) => {
                return Promise.reject(new Error("Failed to add entry to database"));
            });
    }

    public updateUser(user: User): Promise<void> {
        // todo: sanity check the User

        return this.pool.connect()
            .then((client) => {
                return client.query("UPDATE users SET data = $1 WHERE id = $2", [user.stringify(), user.id])
                    .then((res) => {
                        client.release();
                    });
            });
    }

    public getUser(id: string): Promise<User> {
        // todo: sanity check the parameter

        return this.pool.connect()
            .then((client) => {
                return client.query("SELECT data FROM users WHERE id = $1",
                    [id]).then((res): User => {
                        client.release();
                        const data = res.rows[0];
                        return new User(data.data);
                    });
            });
    }

    public addAdmin(admin: Admin) {
        // todo: sanity check the parameter

        return this.pool.connect()
            .then((client) => {
                bcrypt.genSalt(10)
                    .then((salt) => {
                        bcrypt.hash(admin.password, salt)
                            .then((hash) => {
                                client.query("INSERT INTO admins(username, password, permissions) values($1, $2, $3)",
                                    [admin.username, hash, admin.permissions])
                                    .then((res) => {
                                        client.release();
                                    });
                            });
                    });
            });

    }

    public getAdmin(username: string): Promise<Admin> {
        // todo: sanity check the parameter

        return this.pool.connect()
            .then((client) => {
                return client.query("SELECT username, password, permissions FROM admins WHERE username = $1",
                    [username]).then((res): Admin => {
                        client.release();
                        const data = res.rows[0];
                        return new Admin(data.username, data.password, data.permissions);
                    });
            });
    }
}

export default DatabaseClient;
