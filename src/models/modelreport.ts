import { Auth } from "./auth";
import { Ad } from "./ad";
export class ModelReport {
  referenceKeyAds: Ad["primaryKeyAds"];
  referenceKeyUser: Auth["referenceKeyUser"];
  description: string;
  referenceReport: number;
  status: boolean;
  constructor(
    referenceKeyAds: Ad["primaryKeyAds"],
    referenceKeyUser: Auth["referenceKeyUser"],
    description: string
  ) {
    this.referenceKeyAds = referenceKeyAds;
    this.referenceKeyUser = referenceKeyUser;
    this.description = description;
    this.referenceReport = Math.random();
    this.status = false;
  }
}
