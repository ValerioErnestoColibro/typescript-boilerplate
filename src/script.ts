import { User } from "./models/user";
import { Ad } from "./models/ad";
import { Review } from "./models/review";
import { Device } from "./models/device";
import { Auth } from "./models/auth";
import { ModelReport } from "./models/modelreport";
import { Favourite } from "./models/favourite";
import { DocAPI } from "./models/docApi";

export class Marketplace {
  users: ReadonlyArray<User> = [];
  ads: ReadonlyArray<Ad> = [];
  reviews: ReadonlyArray<Review> = [];
  devices: ReadonlyArray<Device> = [];
  auth: ReadonlyArray<Auth> = [];
  reports: ReadonlyArray<ModelReport> = [];
  favourites: ReadonlyArray<Favourite> = [];

  getAuthByToken(token: Auth["token"]) {
    const authFind = this.auth.find((el) => {
      if (el.token === token) return true;
      else return false;
    });

    if (!!authFind) {
      return authFind.referenceKeyUser;
    } else {
      return null;
    }
  }
  register(email: User["email"], password: User["password"]) {
    const userFind = this.users.find((user: User) => {
      if (user.email === email) {
        return true;
      } else {
        return false;
      }
    });

    if (!!userFind) {
      return false;
    } else {
      let newUser = new User(email, password);
      this.users = [...this.users, newUser];
      return true;
    }
  }

  login(email: User["email"], password: User["password"]) {
    const userFind = this.users.find((user: User) => {
      if (user.email === email && user.password === password) {
        return true;
      } else {
        return false;
      }
    });

    if (!!userFind) {
      const newAuth = new Auth(userFind.primaryKeyUser);
      this.auth = [...this.auth, newAuth];
      return newAuth.token;
    } else {
      console.log("utente non registrato");
    }
  }

  logout(token: Auth["token"]) {
    const authFind = this.auth.find((el) => {
      if (el.token === token) {
        return true;
      } else {
        return false;
      }
    });
    if (!!authFind) {
      this.auth = this.auth.filter((auth) => {
        if (auth.token === token) {
          return false;
        } else {
          return true;
        }
      });
      return true;
    } else {
      return false;
    }
  }

  deleteAccount(token: Auth["token"], password: User["password"]) {
    const auth = this.getAuthByToken(token);

    if (!!auth) {
      const passwordFind = this.users.find((el) => {
        if (el.password === password) {
          return true;
        } else return false;
      });
      if (!!passwordFind) {
        this.users = this.users.filter((el) => {
          if (el.password === password) {
            return false;
          } else return true;
        });
        return true;
      } else return false;
    } else return false;
  }

  updateUsername(
    token: Auth["token"],
    referenceKeyUser: Auth["referenceKeyUser"],
    newUsername: User["username"]
  ) {
    // cambio nome

    const auth = this.getAuthByToken(token);

    if (!!auth) {
      const referenceKeyUserFind = this.auth.find((el) => {
        if (el.referenceKeyUser === referenceKeyUser) {
          return true;
        } else return false;
      });

      if (!!referenceKeyUserFind) {
        this.users = this.users.map((el) => {
          if (el.primaryKeyUser === referenceKeyUser) {
            return { ...el, username: newUsername };
            console.log("cambio username effettuato");
          } else {
            return el;
            console.log(
              "non è stato possibile effettuare il cambio dell'username"
            );
          }
        });
      }
      return true;
    } else return false;
  }

  createAd(
    token: Auth["token"],
    referenceKeyUser: Auth["referenceKeyUser"],
    title: Ad["title"],
    description: Ad["description"],
    price: Ad["price"],
    status: Ad["status"],
    category: Ad["category"],
    urlImage: Ad["urlImage"],
    address: Ad["address"],
    referenceKeyUserPurchased: User["primaryKeyUser"]
  ) {
    const auth = this.getAuthByToken(token);

    if (!!auth) {
      const userFind = this.users.find((el) => {
        if (el.primaryKeyUser === referenceKeyUser) {
          return true;
        } else return false;
      });
      if (!!userFind) {
        const newAd = new Ad(
          title,
          description,
          price,
          status,
          referenceKeyUser,
          category,
          urlImage,
          address,
          referenceKeyUserPurchased,
          urlImage
        );
        this.ads = [...this.ads, newAd];
      } else {
        console.log("non è stato possibile creare l'annuncio");
      }
      return true;
    } else {
      return false;
      console.log("token errato");
    }
  }

  editAds(
    token: Auth["token"],
    newTitle: Ad["title"],
    newDescription: Ad["description"],
    newPrice: Ad["price"],
    newStatus: Ad["status"],
    primaryKeyAd: Ad["primaryKeyAd"],
    newCategory: Ad["category"],
    newUrlImage: Ad["urlImage"]
  ) {
    // modificare annuncio

    const auth = this.getAuthByToken(token);

    if (!!auth) {
      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAd === primaryKeyAd) {
          return true;
        } else return false;
      });
      if (!!primaryKeyAdsFind) {
        this.ads = this.ads.map((el) => {
          if (el.primaryKeyAd === primaryKeyAd) {
            return {
              ...el,
              title: newTitle,
              description: newDescription,
              price: newPrice,
              status: newStatus,
              category: newCategory,
              urlImage: newUrlImage,
            };
          } else return el;
        });
      }
      return true;
    } else {
      console.log("token non valido");
      return false;
    }
  }

  deleteAds(token: Auth["token"], primaryKeyAd: Ad["primaryKeyAd"]) {
    const auth = this.getAuthByToken(token);

    if (!!auth) {
      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAd === primaryKeyAd) {
          return true;
        } else return false;
      });
      if (!!primaryKeyAdsFind) {
        this.ads = this.ads.filter((el) => {
          if (el.primaryKeyAd === primaryKeyAd) {
            return false;
          } else return true;
        });
      }
      return true;
    } else return false;
  }

  createReview(
    token: Auth["token"],
    referenceKeyUser: Auth["referenceKeyUser"],
    title: Review["title"],
    description: Review["description"],
    rating: Review["rating"],
    referenceKeyAd: Ad["primaryKeyAd"]
  ) {
    //creare recensione
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      const referenceKeyUserFind = this.auth.find((el) => {
        if (el.referenceKeyUser === referenceKeyUser) {
          return true;
        } else return false;
      });
      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAd === referenceKeyAd) {
          return true;
        } else return false;
      });
      if (!!referenceKeyUserFind && !!primaryKeyAdsFind) {
        const newReview = new Review(
          referenceKeyUser,
          title,
          description,
          rating,
          referenceKeyAd
        );
        this.reviews = [...this.reviews, newReview];
      }
      return true;
    } else return false;
  } //deve essere cliccato due volte

  editReview(
    token: Auth["token"],
    primaryKeyReview: Review["primaryKeyReview"],
    referenceKeyAd: Ad["primaryKeyAd"],
    newTitle: Review["title"],
    newDescription: Review["description"],
    newRating: Review["rating"]
  ) {
    //modificare recensione
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      const primaryKeyReviewFind = this.reviews.find((el) => {
        if (el.primaryKeyReview === primaryKeyReview) {
          return true;
        } else return false;
      });

      const referenceKeyAdFind = this.ads.find((el) => {
        if (el.primaryKeyAd === referenceKeyAd) {
          return true;
        } else return false;
      });

      if (!!primaryKeyReviewFind && !!referenceKeyAdFind) {
        this.reviews = this.reviews.map((el) => {
          if (
            el.primaryKeyReview === primaryKeyReview &&
            el.referenceKeyAds === referenceKeyAd
          ) {
            return {
              ...el,
              title: newTitle,
              description: newDescription,
              rating: newRating,
            };
          } else return el;
        });
      }
      return true;
    } else return false;
  }

  deleteReview(
    token: Auth["token"],
    referenceKeyReview: Review["primaryKeyReview"]
  ) {
    //eliminare recensione
    const auth = this.getAuthByToken(token);

    if (!!auth) {
      const referenceKeyReviewFind = this.reviews.find((el) => {
        if (el.primaryKeyReview === referenceKeyReview) {
          return true;
        } else return false;
      });

      if (!!referenceKeyReviewFind) {
        this.reviews = this.reviews.filter((el) => {
          if (el.primaryKeyReview === referenceKeyReview) {
            return false;
          } else return true;
        });
      }
      return true;
    } else return false;
  }

  createFavoutite(
    token: Auth["token"],
    referenceKeyUser: Auth["referenceKeyUser"],
    referenceKeyAd: Ad["primaryKeyAd"]
  ) {
    const userAuth = this.getAuthByToken(token);
    if (!!userAuth) {
      const referenceKeyUserFind = this.auth.find((el) => {
        if (el.referenceKeyUser === referenceKeyUser) {
          return true;
        } else return false;
      });

      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAd === referenceKeyAd) {
          return true;
        } else return false;
      });
      if (!!primaryKeyAdsFind && !!referenceKeyUserFind) {
        const newFavourite = new Favourite(referenceKeyUser, referenceKeyAd);
        this.favourites = [...this.favourites, newFavourite];
      }
      return true;
    } else return false;
  }

  deleteFavourite(token: Auth["token"], referenceKeyAd: Ad["primaryKeyAd"]) {
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAd === referenceKeyAd) {
          return true;
        } else return false;
      });

      if (!!primaryKeyAdsFind) {
        this.favourites = this.favourites.filter((el) => {
          if (el.referenceKeyAds === referenceKeyAd) {
            return false;
          } else return true;
        });
      }
      return true;
    } else return false;
  }

  // createReports(referenceKeyAd: Ad["primaryKeyAd"], token: Auth["token"], title: string, description: string) {
  //   // Permette a un user di creare un report e lo aggiunge nell'array reports
  //   const auth = this.getAuthByToken(token);
  //   const adFound = this.ads.find(function (ad) {
  //     if (ad.primaryKeyAd === referenceKeyAd) return true;
  //     else return false;
  //   });

  //   if (!!auth) {
  //     if (!!adFound) {
  //       const newReport = new ModelReport(String(auth.referenceKeyUser), referenceKeyAd, title, description);
  //       this.reports = [...this.reports, newReport];
  //       return true;
  //     } else {
  //       console.log("Annuncio non trovato");
  //       return false;
  //     }
  //   } else {
  //     console.log("Autenticazione non effettuata");
  //     return false;
  //   }
  // }

  // closeReports(referenceKeyReport: ModelReport["primaryKeyReport"], token: Auth["token"]) {
  //   // Cerca nell'array reports l'id, se lo trova modifica la voce closed, altrimenti mostra un messaggio di errore
  //   const auth: any = this.getAuthByToken(token);
  //   let reportFound: any = null;
  //   if (!!auth) {
  //     reportFound = this.reports.find(function (report) {
  //       if (report.primaryKeyReport === referenceKeyReport) return true;
  //       else return false;
  //     });

  //     if (!!reportFound) {
  //       this.reports = this.reports.map(function (report) {
  //         if (reportFound.primaryKeyReport === report.primaryKeyReport)
  //           return {
  //             ...auth,
  //             closed: true,
  //           };
  //         else return auth;
  //       });
  //       return true;
  //     } else {
  //       console.log("Report non trovato");
  //       return false;
  //     }
  //   } else {
  //     console.log("Autenticazione non effettuata");
  //     return false;
  //   }
  // }

  listFiltredByCategory(token: Auth["token"], category: Ad["category"]) {
    //lista filtrata
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      const categoryFind = this.ads.find((el) => {
        if (el.category === category) {
          return true;
        } else return false;
      });

      if (!!categoryFind) {
        return this.ads.filter((el) => {
          if (el.category === category) {
            return true;
          } else return false;
        });
      }
      return true;
    } else return false;
  }
  markAsSold(
    token: Auth["token"],
    referenceKeyAd: Ad["primaryKeyAd"],
    referenceKeyUserPurchased: Auth["referenceKeyUser"]
  ) {
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAd === referenceKeyAd) {
          return true;
        } else return false;
      });

      if (!!primaryKeyAdsFind) {
        this.ads = this.ads.map((el) => {
          if (el.primaryKeyAd === referenceKeyAd) {
            return {
              ...el,
              referenceKeyUserPurchased: referenceKeyUserPurchased,
            };
          } else {
            return el;
            console.log("nessun annuncio corrisponde alla tua ricerca");
          }
        });
      }
      return true;
    } else return false;
  }

  listUsers() {
    return this.users;
  }

  listAds() {
    return this.ads;
  }

  listFavourites() {
    return this.favourites;
  }
  listReviews() {
    return this.reviews;
  }
  listAuth() {
    return this.auth;
  }
}

const apis = {
  register: new DocAPI("/auth/register", "POST", false),
  login: new DocAPI("/auth/login", "POST", false),
  logout: new DocAPI("/auth/logout", "GET", true),
  deleteAccount: new DocAPI("/users/{primaryKeyUser}", "DELETE", true),
  updateUsername: new DocAPI("/users/{primaryKeyUser}", "PATCH", true),
  createAds: new DocAPI("/ads", "POST", true),
  editAds: new DocAPI("/ads/{primaryKeyAds}", "PUT", true),
  deleteAds: new DocAPI("/ads/{primaryKeyAds}", "DELETE", true),
  addReview: new DocAPI("/reviews", "POST", true),
  editReview: new DocAPI("/reviews/{primaryKReview}", "PUT", true),
  deleteReview: new DocAPI("/reviews/{primaryKReview}", "DELETE", true),
  addFavoutite: new DocAPI("/s", "POST", true),
  deleteFavourite: new DocAPI("/s/{primaryKeyFavourite}", "DELETE", true),
  getListPurchasedToBeConfirmedByUserPurchased: new DocAPI(
    "ads/{primaryKeyAds}/purchased",
    "GET",
    true
  ),
  markAsSold: new DocAPI("/ads/{primaryKeyAds}", "PATCH", true),
  getAuthByToken: new DocAPI("/auth", "GET", true),
  listFiltred: new DocAPI("/ads?category={category}", "GET", true), //da vedere meglio i query
};
