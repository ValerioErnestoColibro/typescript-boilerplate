import { User } from "../models/user";
import { Auth } from "./auth";
export class Ad {
  title: string;
  description: string;
  price: number;
  status: string;
  referenceKeyUser: Auth["referenceKeyUser"];
  category: string;
  urlForImage: string;
  address: string;
  referenceKeyUserPurchased: string;
  date: Date;
  primaryKeyAds: number;
  urlImage: string;
  constructor(
    title: string,
    description: string,
    price: number,
    status: string,
    referenceKeyUser: User["primaryKeyUser"],
    category: string,
    urlForImage: string,
    address: string,
    referenceKeyUserPurchased: string,
    urlImage: string
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.status = status;
    this.referenceKeyUser = referenceKeyUser;
    this.category = category;
    this.urlForImage = urlForImage;
    this.address = address;
    this.referenceKeyUserPurchased = referenceKeyUserPurchased;
    this.date = new Date();
    this.primaryKeyAds = Math.random();
    this.urlImage = urlImage;
  }
}
