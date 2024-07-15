import { Auth } from "./auth";
import { Ad } from "./ad";
export class ModelReport {
  title: string;
  referenceKeyAd: Ad["primaryKeyAd"];
  referenceKeyUser: Auth["referenceKeyUser"];
  description: string;
  primaryKeyReport: number;
  constructor(
    title: string,
    referenceKeyAd: Ad["primaryKeyAd"],
    referenceKeyUser: Auth["referenceKeyUser"],
    description: string
  ) {
    this.title = title;
    this.referenceKeyAd = referenceKeyAd;
    this.referenceKeyUser = referenceKeyUser;
    this.description = description;
    this.primaryKeyReport = Math.random();
  }
}
