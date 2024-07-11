"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marketplace = void 0;
const user_1 = require("./exercise dubito/src/models/user");
const ad_1 = require("./exercise dubito/src/models/ad");
const review_1 = require("./exercise dubito/src/models/review");
const auth_1 = require("./exercise dubito/src/models/auth");
const favourite_1 = require("./exercise dubito/src/models/favourite");
const docApi_1 = require("./exercise dubito/src/models/docApi");
class Marketplace {
  constructor() {
    this.users = [];
    this.ads = [];
    this.reviews = [];
    this.devices = [];
    this.auth = [];
    this.reports = [];
    this.favourites = [];
  }
  register(email, password) {
    const userFind = this.users.find((user) => {
      if (user.email === email) {
        return true;
      } else {
        return false;
      }
    });
    if (!!userFind) {
      console.log("email gia esistente");
      return true;
    } else {
      let newUser = new user_1.User(email, password);
      this.users = [...this.users, newUser];
      console.log("registrazione effettuata con successo");
      return false;
    }
  }
  login(email, password) {
    const userFind = this.users.find((user) => {
      if (user.email === email && user.password === password) {
        return true;
      } else {
        return false;
      }
    });
    if (!!userFind && this.devices.length <= 2) {
      const newAuth = new auth_1.Auth(userFind.primaryKeyUser);
      this.auth = [...this.auth, newAuth];
      return newAuth.token;
    } else {
      console.log("utente non registrato");
    }
  }
  logout(token) {
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
      console.log("logout effettuato con successo");
    } else {
      console.log("token non valido");
    }
  }
  deleteAccount(token, password) {
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
        console.log("eliminazione account avvenuta con successo");
      } else console.log("password non corretta");
    } else console.log("token non valido");
  }
  updateUsername(token, referenceKeyUser, newUsername) {
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
            return Object.assign(Object.assign({}, el), {
              username: newUsername,
            });
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
    token,
    referenceKeyUser,
    title,
    description,
    price,
    status,
    category,
    urlImage,
    address,
    referenceKeyUserPurchased
  ) {
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      const userFind = this.users.find((el) => {
        if (el.primaryKeyUser === referenceKeyUser) {
          return true;
        } else return false;
      });
      if (!!userFind) {
        const newAds = new ad_1.Ad(
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
    token,
    newTitle,
    newDescription,
    newPrice,
    newStatus,
    referenceKeyUser,
    primaryKeyAds,
    newCategory,
    newUrlForImage
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
            return Object.assign(Object.assign({}, el), {
              title: newTitle,
              description: newDescription,
              price: newPrice,
              status: newStatus,
              category: newCategory,
              urlForImage: newUrlForImage,
            });
          } else return el;
        });
      } else console.log("annuncio non trovato");
    } else console.log("token non valido");
  }
  deletetAds(token, primaryKeyAds) {
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
    token,
    referenceKeyUser,
    title,
    description,
    rating,
    referenceKeyAds
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
        const newReview = new review_1.Review(
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
    token,
    referenceKeyUser,
    title,
    description,
    rating,
    referenceKeyAds
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
            return Object.assign(Object.assign({}, el), {
              title: title,
              description: description,
              rating: rating,
            });
          } else {
            return el;
            console.log("non è stato possibile modificare la recensione");
          }
        });
      }
    } else console.log("token non valido");
  }
  deleteReview(token, referenceKeyUser, referenceKeyAds) {
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
  createFavoutite(token, referenceKeyUser, referenceKeyAds) {
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
        const newFavourite = new favourite_1.Favourite(
          referenceKeyUser,
          referenceKeyAds
        );
        this.favourites = [...this.favourites, newFavourite];
        console.log("annuncio aggiunto ai preferiti");
      } else console.log("annuncio non aggiunto");
    } else {
      console.log("token non valido");
    }
  }
  deleteFavourite(token, referenceKeyAds, referenceKeyUser) {
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
  getAuthByToken(token) {
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
  listFiltredByCategory(token, category) {
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
  markAsSold(token, referenceKeyAds, referenceKeyUser) {
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
            return Object.assign(Object.assign({}, el), {
              referenceKeyUserPurchased: referenceKeyUser,
            });
          } else {
            return el;
            console.log("nessun annuncio corrisponde alla tua ricerca");
          }
        });
      }
    } else console.log("token non valido");
  }
}
exports.Marketplace = Marketplace;
const apis = {
  register: new docApi_1.DocAPI("/auth/register", "POST", false),
  login: new docApi_1.DocAPI("/auth/login", "POST", false),
  logout: new docApi_1.DocAPI("/auth/logout", "GET", true),
  deleteAccount: new docApi_1.DocAPI("/users/{primaryKeyUser}", "DELETE", true),
  updateUsername: new docApi_1.DocAPI("/users/{primaryKeyUser}", "PATCH", true),
  createAds: new docApi_1.DocAPI("/ads", "POST", true),
  editAds: new docApi_1.DocAPI("/ads/{primaryKeyAds}", "PUT", true),
  deleteAds: new docApi_1.DocAPI("/ads/{primaryKeyAds}", "DELETE", true),
  addReview: new docApi_1.DocAPI("/reviews", "POST", true),
  editReview: new docApi_1.DocAPI("/reviews/{primaryKReview}", "PUT", true),
  deleteReview: new docApi_1.DocAPI(
    "/reviews/{primaryKReview}",
    "DELETE",
    true
  ),
  addFavoutite: new docApi_1.DocAPI("/s", "POST", true),
  deleteFavourite: new docApi_1.DocAPI(
    "/s/{primaryKeyFavourite}",
    "DELETE",
    true
  ),
  getListPurchasedToBeConfirmedByUserPurchased: new docApi_1.DocAPI(
    "ads/{primaryKeyAds}/purchased",
    "GET",
    true
  ),
  markAsSold: new docApi_1.DocAPI("/ads/{primaryKeyAds}", "PATCH", true),
  getAuthByToken: new docApi_1.DocAPI("/auth", "GET", true),
  listFiltred: new docApi_1.DocAPI("/ads?category={category}", "GET", true), //da vedere meglio i query
};
