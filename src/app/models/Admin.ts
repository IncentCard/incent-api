export class Admin {
    private _username: string;
    private _password: string;
    private _permissions: string[];

    public constructor(username: string, password: string, permissions: string[]) {
        this.username = username;
        this.password = password;
        this.permissions = permissions;
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
        this._password = value;
    }

    /**
     * Getter permissions
     * @return {string[]}
     */
    public get permissions(): string[] {
        return this._permissions;
    }

    /**
     * Setter permissions
     * @param {string[]} value
     */
    public set permissions(value: string[]) {
        this._permissions = value;
    }
}
