import { MarqetaUser } from "./MarqetaUser";

export interface IUser {
  id: string;

  // optional parameters
  address1?: string;
  birthDate?: string;
  city?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  ssn?: string;
  state?: string;
  zip?: string;
}

export class User implements IUser {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _address1: string;
  private _city: string;
  private _state: string;
  private _zip: string;
  private _country: string;
  private _birthDate: string;
  private _ssn: string;

  public constructor(json: IUser | MarqetaUser) {
    if (!json) {
      throw new Error("You must provide an ID or Token");
    }
    const isMarqeta = this.isMarqetaUser(json);

    this.id = isMarqeta ? (json as MarqetaUser).token : (json as IUser).id;
    this.firstName = isMarqeta ? (json as MarqetaUser).first_name : (json as IUser).firstName;
    this.lastName = isMarqeta ? (json as MarqetaUser).last_name : (json as IUser).lastName;
    this.address1 = json.address1;
    this.city = json.city;
    this.state = json.state;
    this.zip = json.zip;
    this.country = json.country;
    this.birthDate = isMarqeta ? (json as MarqetaUser).birth_date : (json as IUser).birthDate;
    this.ssn = json.ssn;
  }

  public convertToMarqeta(): MarqetaUser {
    return {
      address1: this.address1,
      birth_date: this.birthDate,
      city: this.city,
      country: this.country,
      first_name: this.firstName,
      last_name: this.lastName,
      ssn: this.ssn,
      state: this.state,
      token: this.id,
      zip: this.zip,
    };
  }

  public convertToJSON(): any {
    return {
      address1: this.address1,
      birthDate: this.birthDate,
      city: this.city,
      country: this.country,
      firstName: this.firstName,
      id: this.id,
      lastName: this.lastName,
      ssn: this.ssn,
      state: this.state,
      zip: this.zip,
    };
  }

  public stringify(): string {
    return JSON.stringify(this.convertToJSON());
  }

  private isMarqetaUser(object: any): object is MarqetaUser {
    return "token" in object;
  }

  //////// Getters and Setters ////////
  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Setter id
   * @param {string} value
   */
  public set id(value: string) {
    this._id = value;
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
    this._firstName = value;
  }

  /**
   * Getter lastName
   * @return {string}
   */
  public get lastName(): string {
    return this._lastName;
  }

  /**
   * Setter lastName
   * @param {string} value
   */
  public set lastName(value: string) {
    this._lastName = value;
  }

  /**
   * Getter address1
   * @return {string}
   */
  public get address1(): string {
    return this._address1;
  }

  /**
   * Setter address1
   * @param {string} value
   */
  public set address1(value: string) {
    this._address1 = value;
  }

  /**
   * Getter city
   * @return {string}
   */
  public get city(): string {
    return this._city;
  }

  /**
   * Setter city
   * @param {string} value
   */
  public set city(value: string) {
    this._city = value;
  }

  /**
   * Getter state
   * @return {string}
   */
  public get state(): string {
    return this._state;
  }

  /**
   * Setter state
   * @param {string} value
   */
  public set state(value: string) {
    this._state = value;
  }

  /**
   * Getter zip
   * @return {string}
   */
  public get zip(): string {
    return this._zip;
  }

  /**
   * Setter zip
   * @param {string} value
   */
  public set zip(value: string) {
    this._zip = value;
  }

  /**
   * Getter country
   * @return {string}
   */
  public get country(): string {
    return this._country;
  }

  /**
   * Setter country
   * @param {string} value
   */
  public set country(value: string) {
    this._country = value;
  }

  /**
   * Getter birthDate
   * @return {string}
   */
  public get birthDate(): string {
    return this._birthDate;
  }

  /**
   * Setter birthDate
   * @param {string} value
   */
  public set birthDate(value: string) {
    this._birthDate = value;
  }

  /**
   * Getter ssn
   * @return {string}
   */
  public get ssn(): string {
    return this._ssn;
  }

  /**
   * Setter ssn
   * @param {string} value
   */
  public set ssn(value: string) {
    this._ssn = value;
  }

}
