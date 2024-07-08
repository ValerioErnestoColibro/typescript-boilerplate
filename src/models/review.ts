import { Auth } from "./auth";
import { Ad } from "./ad";
export class Review {
  referenceKeyUser: Auth["referenceKeyUser"];
  time: Date;
  description: string;
  rating: number;
  title: string;
  referenceKeyAds: Ad["primaryKeyAds"];
  primaryKeyReview: number;
  constructor(
    referenceKeyUser: Auth["referenceKeyUser"],
    title: string,
    description: string,
    rating: number,
    referenceKeyAds: Ad["primaryKeyAds"]
  ) {
    this.referenceKeyUser = referenceKeyUser;
    this.time = new Date();
    this.description = description;
    this.rating = rating;
    this.title = title;
    this.referenceKeyAds = referenceKeyAds;
    this.primaryKeyReview = Math.random();
  }
}
