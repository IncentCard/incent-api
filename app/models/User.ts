import { MarqetaUser } from "./MarqetaUser";

export class User {
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

  public constructor(json: any = {}) {
    this.id = json.id;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.address1 = json.address1;
    this.city = json.city;
    this.state = json.state;
    this.zip = json.zip;
    this.country = json.country;
    this.birthDate = json.birthDate;
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
