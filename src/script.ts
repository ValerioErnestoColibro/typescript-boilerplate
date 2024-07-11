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

  register(email: string, password: string) {
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

  deleteAccount(token: Auth["token"], password: string) {
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
    } else console.log("token errato");
  }

  createAds(
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
        const newAds = new Ad(
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
        this.ads = [...this.ads, newAds];
        console.log("annuncio creato con successo");
      } else {
        console.log("non è stato possibile creare l'annuncio");
      }
    } else {
      console.log("token non esiste");
    }
  }

  editAds(
    token: Auth["token"],
    newTitle: Ad["title"],
    newDescription: Ad["description"],
    newPrice: Ad["price"],
    newStatus: Ad["status"],
    referenceKeyUser: Auth["referenceKeyUser"],
    primaryKeyAds: Ad["primaryKeyAds"],
    newCategory: Ad["category"],
    newUrlForImage: Ad["urlImage"]
  ) {
    // modificare annuncio

    const auth = this.getAuthByToken(token);

    if (!!auth) {
      const referenceKeyUserFind = this.auth.find((el) => {
        if (el.referenceKeyUser === referenceKeyUser) {
          return true;
        } else return false;
      });

      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAds === primaryKeyAds) {
          return true;
        } else return false;
      });
      if (!!primaryKeyAdsFind && !!referenceKeyUserFind) {
        this.ads = this.ads.map((el) => {
          if (
            el.primaryKeyAds === primaryKeyAds &&
            el.referenceKeyUser === referenceKeyUser
          ) {
            return {
              ...el,
              title: newTitle,
              description: newDescription,
              price: newPrice,
              status: newStatus,
              category: newCategory,
              urlForImage: newUrlForImage,
            };
          } else return el;
        });
      } else console.log("annuncio non trovato");
    } else console.log("token non valido");
  }

  deletetAds(token: Auth["token"], primaryKeyAds: Ad["primaryKeyAds"]) {
    const auth = this.getAuthByToken(token);

    if (!!auth) {
      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAds === primaryKeyAds) {
          return true;
        } else return false;
      });
      if (!!primaryKeyAdsFind) {
        this.ads = this.ads.filter((el) => {
          if (el.primaryKeyAds === primaryKeyAds) {
            return false;
          } else return true;
        });
        console.log("eliminazione annuncio avvenuta con successo");
      } else console.log("non è stato possibile cancellare l'annuncio");
    } else console.log("token non valido");
  }

  createReview(
    token: Auth["token"],
    referenceKeyUser: Auth["referenceKeyUser"],
    title: Review["title"],
    description: Review["description"],
    rating: Review["rating"],
    referenceKeyAds: Ad["primaryKeyAds"]
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
        if (el.primaryKeyAds === referenceKeyAds) {
          return true;
        } else return false;
      });
      if (!!referenceKeyUserFind && !!primaryKeyAdsFind) {
        const newReview = new Review(
          referenceKeyUser,
          title,
          description,
          rating,
          referenceKeyAds
        );
        this.reviews = [...this.reviews, newReview];
      } else console.log("non è stato possibile creare la recensione");
    } else console.log("token non valido");
  }

  editReview(
    token: Auth["token"],
    referenceKeyUser: Auth["referenceKeyUser"],
    title: Review["title"],
    description: Review["description"],
    rating: Review["rating"],
    referenceKeyAds: Ad["primaryKeyAds"]
  ) {
    //modificare recensione
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      const referenceKeyUserFind = this.auth.find((el) => {
        if (el.referenceKeyUser === referenceKeyUser) {
          return true;
        } else return false;
      });
      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAds === referenceKeyAds) {
          return true;
        } else return false;
      });

      if (!!referenceKeyUserFind && !!primaryKeyAdsFind) {
        this.reviews = this.reviews.map((el) => {
          if (
            el.referenceKeyUser === referenceKeyUser &&
            el.referenceKeyAds === referenceKeyAds
          ) {
            return {
              ...el,
              title: title,
              description: description,
              rating: rating,
            };
          } else {
            return el;
            console.log("non è stato possibile modificare la recensione");
          }
        });
      }
    } else console.log("token non valido");
  }

  deleteReview(
    token: Auth["token"],
    referenceKeyUser: Auth["referenceKeyUser"],
    referenceKeyAds: Ad["primaryKeyAds"]
  ) {
    //eliminare recensione
    const auth = this.getAuthByToken(token);

    if (!!auth) {
      const referenceKeyUserFind = this.auth.find((el) => {
        if (el.referenceKeyUser === referenceKeyUser) {
          return true;
        } else return false;
      });
      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAds === referenceKeyAds) {
          return true;
        } else return false;
      });
      if (!!primaryKeyAdsFind) {
        this.reviews = this.reviews.filter((el) => {
          if (
            el.referenceKeyAds === referenceKeyAds &&
            el.referenceKeyUser === referenceKeyUser
          ) {
            return false;
          } else return true;
        });
        console.log("eliminazione review avvenuta con successo");
      } else console.log("ads sbagliato");
    } else console.log("token non valido");
  }

  createFavoutite(
    token: Auth["token"],
    referenceKeyUser: Auth["referenceKeyUser"],
    referenceKeyAds: Ad["primaryKeyAds"]
  ) {
    const userAuth = this.getAuthByToken(token);
    if (!!userAuth) {
      const referenceKeyUserFind = this.auth.find((el) => {
        if (el.referenceKeyUser === referenceKeyUser) {
          return true;
        } else return false;
      });

      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAds === referenceKeyAds) {
          return true;
        } else return false;
      });
      if (!!primaryKeyAdsFind && !!referenceKeyUserFind) {
        const newFavourite = new Favourite(referenceKeyUser, referenceKeyAds);
        this.favourites = [...this.favourites, newFavourite];
        console.log("annuncio aggiunto ai preferiti");
      } else console.log("annuncio non aggiunto");
    } else {
      console.log("token non valido");
    }
  }

  deleteFavourite(
    token: Auth["token"],
    referenceKeyAds: Ad["primaryKeyAds"],
    referenceKeyUser: Auth["referenceKeyUser"]
  ) {
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      const referenceKeyUserFind = this.auth.find((el) => {
        if (el.referenceKeyUser === referenceKeyUser) {
          return true;
        } else return false;
      });
      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAds === referenceKeyAds) {
          return true;
        } else return false;
      });

      if (!!primaryKeyAdsFind && !!referenceKeyUserFind) {
        this.favourites = this.favourites.filter((el) => {
          if (
            el.referenceKeyUser === referenceKeyUser &&
            el.referenceKeyAds === referenceKeyAds
          ) {
            return false;
          } else return true;
        });
      }
    } else console.log("token non valido");
  }

  //   getListPurchasedToBeConfirmedByUserPurchased(token: Auth["token"]) {
  //     const auth = this.getAuthByToken(token);
  //     if (!!auth) {
  //       const primaryKeyAdsFind = this.ads.find((el) => {
  //         if (el.referenceKeyUserPurchased === null) {
  //           return true;
  //         } else return false;
  //       });
  //       if (!!primaryKeyAdsFind) {
  //         return this.ads.filter((el) => {
  //           if (el.referenceKeyUserPurchased === null) {
  //             return true;
  //             console.log("nessun annuncion corrisponde alla tua ricerca");
  //           } else return false;
  //         });
  //       }
  //     }
  //   }
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
      } else console.log("nessun annuncio per questa categoria");
    } else console.log("token non valido");
  }
  markAsSold(
    token: Auth["token"],
    referenceKeyAds: Ad["primaryKeyAds"],
    referenceKeyUser: Auth["referenceKeyUser"]
  ) {
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      const primaryKeyAdsFind = this.ads.find((el) => {
        if (el.primaryKeyAds === referenceKeyAds) {
          return true;
        } else return false;
      });

      if (!!primaryKeyAdsFind) {
        this.ads = this.ads.map((el) => {
          if (el.primaryKeyAds === referenceKeyAds) {
            return {
              ...el,
              referenceKeyUserPurchased: referenceKeyUser,
            };
          } else {
            return el;
            console.log("nessun annuncio corrisponde alla tua ricerca");
          }
        });
      }
    } else console.log("token non valido");
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
