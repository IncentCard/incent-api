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
  favoriteFood?: string;
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
  private _favoriteFood: string;

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

    // set IUser only values
    if (!isMarqeta) {
      json = json as IUser;
      this.favoriteFood = json.favoriteFood;
    }
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

  /**
   * Converts the object to JSON. Gives the option to remove any fields that would be present in MarqetaUser.
   * @param compress Default is false. If true any fields that would exist in MarqetaUser are omitted from the JSON.
   */
  public convertToJSON(compress = false): IUser {
    const json: IUser = {
      favoriteFood: this.favoriteFood || null,
      id: this.id,
    };

    if (!compress) {
      json.address1 = this.address1;
      json.birthDate = this.birthDate;
      json.city = this.city;
      json.country = this.country;
      json.firstName = this.firstName;
      json.lastName = this.lastName;
      json.ssn = this.ssn;
      json.state = this.state;
      json.zip = this.zip;
    }

    return json;
  }

  public stringify(compress = false): string {
    return JSON.stringify(this.convertToJSON(compress));
  }

  /**
   * Merges two user objects together. Any field present on the passed in User overwrites the value in this User.
   * @param other The other user to merge into this one.
   */
  public merge(other: User) {
    this.id = other.id || this.id;
    this.firstName = other.firstName || this.firstName;
    this.lastName = other.lastName || this.lastName;
    this.address1 = other.address1 || this.address1;
    this.city = other.city || this.city;
    this.state = other.state || this.state;
    this.zip = other.zip || this.zip;
    this.country = other.country || this.country;
    this.birthDate = other.birthDate || this.birthDate;
    this.ssn = other.ssn || this.ssn;
    this.favoriteFood = other.favoriteFood || this.favoriteFood;
  }

  private isMarqetaUser(object: any): object is MarqetaUser {
    return "token" in object;
  }

  //////// Getters and Setters ////////

  /**
   * Getter favoriteFood
   * @return {string}
   */
  public get favoriteFood(): string {
    return this._favoriteFood;
  }

  /**
   * Setter favoriteFood
   * @param {string} value
   */
  public set favoriteFood(value: string) {
    this._favoriteFood = value;
  }

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
    if (!value) {
      throw new Error("ID can't be set to null, undefined, or empty string");
    }
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
