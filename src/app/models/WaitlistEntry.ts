export interface IWaitListEntry {
    email: string;
    firstName: string;
}

export default class WaitlistEntry implements IWaitListEntry {
    private _email: string;
    private _firstName: string;

    constructor(email: string, firstName: string) {
        if (!email) {
            throw new Error("You must provide an email");
        }
        if (!firstName) {
            throw new Error("You must provide firstName");
        }
        this.email = email;
        this.firstName = firstName;
    }

    /**
     * Getter email
     * @return {string}
     */
    public get email(): string {
        return this._email;
    }

    /**
     * Setter email
     * @param {string} value
     */
    public set email(value: string) {
        if (!value) {
            throw new Error("You must provide an email");
        }
        this._email = value;
    }

    /**
     * Getter firstName
     * @return {string}
     */
    public get firstName(): string {
        return this._firstName;
    }

    /**
     * Setter firstName
     * @param {string} value
     */
    public set firstName(value: string) {
        if (!value) {
            throw new Error("You must provide firstName");
        }
        this._firstName = value;
    }

}
