import { Auth } from "./auth";
export class Device {
  referenceKeyUser: Auth["referenceKeyUser"];
  primarKeyDevice: number;
  constructor(referenceKeyUser: Auth["referenceKeyUser"]) {
    this.referenceKeyUser = referenceKeyUser;
    this.primarKeyDevice = Math.random();
  }
}
