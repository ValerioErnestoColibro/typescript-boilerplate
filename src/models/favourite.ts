import { Auth } from "./auth";
import { Ad } from "./ad";
export class Favourite {
  referenceKeyUser: Auth["referenceKeyUser"];
  referenceKeyAds: Ad["primaryKeyAd"];
  primaryKey: number;
  constructor(
    referenceKeyUser: Auth["referenceKeyUser"],
    referenceKeyAds: Ad["primaryKeyAd"]
  ) {
    this.referenceKeyUser = referenceKeyUser;
    this.referenceKeyAds = referenceKeyAds;
    this.primaryKey = Math.random();
  }
}
