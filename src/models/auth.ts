import { User } from "../models/user";
export class Auth {
  referenceKeyUser: User["primaryKeyUser"];
  primaryKeyAuth: number;
  token: number;
  constructor(referenceKeyUser: User["primaryKeyUser"]) {
    this.referenceKeyUser = referenceKeyUser;
    this.primaryKeyAuth = Math.random();
    this.token = Math.random();
  }
}
