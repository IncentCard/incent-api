export class Admin {
    private _username: string;
    private _password: string;

    public constructor(username: string, password: string) {
        this.checkUsername(username);
        this.checkPassword(password);

        this.username = username;
        this.password = password;
    }

    private checkUsername(username: string): void {
        if (!username) {
            throw new Error("Username is required");
        }
    }

    private checkPassword(password: string): void {
        if (!password) {
            throw new Error("Password is required and can't be empty");
        }
    }

    //////// Getters and Setters ////////
    /**
     * Getter username
     * @return {string}
     */
    public get username(): string {
        return this._username;
    }

    /**
     * Setter username
     * @param {string} value
     */
    public set username(value: string) {
        this.checkUsername(value);
        this._username = value;
    }

    /**
     * Getter password
     * @return {string}
     */
    public get password(): string {
        return this._password;
    }

    /**
     * Setter password
     * @param {string} value
     */
    public set password(value: string) {
        this.checkPassword(value);
        this._password = value;
    }
}
