"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marketplace = void 0;
const user_1 = require("./models/user");
const ad_1 = require("./models/ad");
const review_1 = require("./models/review");
const auth_1 = require("./models/auth");
const favourite_1 = require("./models/favourite");
const docApi_1 = require("./models/docApi");
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
    getAuthByToken(token) {
        const authFind = this.auth.find((el) => {
            if (el.token === token)
                return true;
            else
                return false;
        });
        if (!!authFind) {
            return authFind.referenceKeyUser;
        }
        else {
            return null;
        }
    }
    register(email, password) {
        const userFind = this.users.find((user) => {
            if (user.email === email) {
                return true;
            }
            else {
                return false;
            }
        });
        if (!!userFind) {
            return false;
        }
        else {
            let newUser = new user_1.User(email, password);
            this.users = [...this.users, newUser];
            return true;
        }
    }
    login(email, password) {
        const userFind = this.users.find((user) => {
            if (user.email === email && user.password === password) {
                return true;
            }
            else {
                return false;
            }
        });
        if (!!userFind) {
            const newAuth = new auth_1.Auth(userFind.primaryKeyUser);
            this.auth = [...this.auth, newAuth];
            return newAuth.token;
        }
        else {
            console.log("utente non registrato");
        }
    }
    logout(token) {
        const authFind = this.auth.find((el) => {
            if (el.token === token) {
                return true;
            }
            else {
                return false;
            }
        });
        if (!!authFind) {
            this.auth = this.auth.filter((auth) => {
                if (auth.token === token) {
                    return false;
                }
                else {
                    return true;
                }
            });
            return true;
        }
        else {
            return false;
        }
    }
    deleteAccount(token, password) {
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const passwordFind = this.users.find((el) => {
                if (el.password === password) {
                    return true;
                }
                else
                    return false;
            });
            if (!!passwordFind) {
                this.users = this.users.filter((el) => {
                    if (el.password === password) {
                        return false;
                    }
                    else
                        return true;
                });
                return true;
            }
            else
                return false;
        }
        else
            return false;
    }
    updateUsername(token, referenceKeyUser, newUsername) {
        // cambio nome
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const referenceKeyUserFind = this.auth.find((el) => {
                if (el.referenceKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            if (!!referenceKeyUserFind) {
                this.users = this.users.map((el) => {
                    if (el.primaryKeyUser === referenceKeyUser) {
                        return Object.assign(Object.assign({}, el), { username: newUsername });
                        console.log("cambio username effettuato");
                    }
                    else {
                        return el;
                        console.log("non è stato possibile effettuare il cambio dell'username");
                    }
                });
            }
            return true;
        }
        else
            return false;
    }
    createAd(token, referenceKeyUser, title, description, price, status, category, urlImage, address, referenceKeyUserPurchased) {
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const userFind = this.users.find((el) => {
                if (el.primaryKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            if (!!userFind) {
                const newAd = new ad_1.Ad(title, description, price, status, referenceKeyUser, category, urlImage, address, referenceKeyUserPurchased, urlImage);
                this.ads = [...this.ads, newAd];
            }
            else {
                console.log("non è stato possibile creare l'annuncio");
            }
            return true;
        }
        else {
            return false;
            console.log("token errato");
        }
    }
    editAds(token, newTitle, newDescription, newPrice, newStatus, primaryKeyAd, newCategory, newUrlImage) {
        // modificare annuncio
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const primaryKeyAdsFind = this.ads.find((el) => {
                if (el.primaryKeyAd === primaryKeyAd) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind) {
                this.ads = this.ads.map((el) => {
                    if (el.primaryKeyAd === primaryKeyAd) {
                        return Object.assign(Object.assign({}, el), { title: newTitle, description: newDescription, price: newPrice, status: newStatus, category: newCategory, urlImage: newUrlImage });
                    }
                    else
                        return el;
                });
            }
            return true;
        }
        else {
            console.log("token non valido");
            return false;
        }
    }
    deleteAds(token, primaryKeyAd) {
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const primaryKeyAdsFind = this.ads.find((el) => {
                if (el.primaryKeyAd === primaryKeyAd) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind) {
                this.ads = this.ads.filter((el) => {
                    if (el.primaryKeyAd === primaryKeyAd) {
                        return false;
                    }
                    else
                        return true;
                });
            }
            return true;
        }
        else
            return false;
    }
    createReview(token, referenceKeyUser, title, description, rating, referenceKeyAd) {
        //creare recensione
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const referenceKeyUserFind = this.auth.find((el) => {
                if (el.referenceKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            const primaryKeyAdsFind = this.ads.find((el) => {
                if (el.primaryKeyAd === referenceKeyAd) {
                    return true;
                }
                else
                    return false;
            });
            if (!!referenceKeyUserFind && !!primaryKeyAdsFind) {
                const newReview = new review_1.Review(referenceKeyUser, title, description, rating, referenceKeyAd);
                this.reviews = [...this.reviews, newReview];
            }
            return true;
        }
        else
            return false;
    } //deve essere cliccato due volte
    editReview(token, primaryKeyReview, referenceKeyAd, newTitle, newDescription, newRating) {
        //modificare recensione
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const primaryKeyReviewFind = this.reviews.find((el) => {
                if (el.primaryKeyReview === primaryKeyReview) {
                    return true;
                }
                else
                    return false;
            });
            const referenceKeyAdFind = this.ads.find((el) => {
                if (el.primaryKeyAd === referenceKeyAd) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyReviewFind && !!referenceKeyAdFind) {
                this.reviews = this.reviews.map((el) => {
                    if (el.primaryKeyReview === primaryKeyReview &&
                        el.referenceKeyAds === referenceKeyAd) {
                        return Object.assign(Object.assign({}, el), { title: newTitle, description: newDescription, rating: newRating });
                    }
                    else
                        return el;
                });
            }
            return true;
        }
        else
            return false;
    }
    deleteReview(token, referenceKeyReview) {
        //eliminare recensione
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const referenceKeyReviewFind = this.reviews.find((el) => {
                if (el.primaryKeyReview === referenceKeyReview) {
                    return true;
                }
                else
                    return false;
            });
            if (!!referenceKeyReviewFind) {
                this.reviews = this.reviews.filter((el) => {
                    if (el.primaryKeyReview === referenceKeyReview) {
                        return false;
                    }
                    else
                        return true;
                });
            }
            return true;
        }
        else
            return false;
    }
    createFavoutite(token, referenceKeyUser, referenceKeyAd) {
        const userAuth = this.getAuthByToken(token);
        if (!!userAuth) {
            const referenceKeyUserFind = this.auth.find((el) => {
                if (el.referenceKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            const primaryKeyAdsFind = this.ads.find((el) => {
                if (el.primaryKeyAd === referenceKeyAd) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind && !!referenceKeyUserFind) {
                const newFavourite = new favourite_1.Favourite(referenceKeyUser, referenceKeyAd);
                this.favourites = [...this.favourites, newFavourite];
            }
            return true;
        }
        else
            return false;
    }
    deleteFavourite(token, referenceKeyAd) {
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const primaryKeyAdsFind = this.ads.find((el) => {
                if (el.primaryKeyAd === referenceKeyAd) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind) {
                this.favourites = this.favourites.filter((el) => {
                    if (el.referenceKeyAds === referenceKeyAd) {
                        return false;
                    }
                    else
                        return true;
                });
            }
            return true;
        }
        else
            return false;
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
    listFiltredByCategory(token, category) {
        //lista filtrata
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const categoryFind = this.ads.find((el) => {
                if (el.category === category) {
                    return true;
                }
                else
                    return false;
            });
            if (!!categoryFind) {
                return this.ads.filter((el) => {
                    if (el.category === category) {
                        return true;
                    }
                    else
                        return false;
                });
            }
            return true;
        }
        else
            return false;
    }
    markAsSold(token, referenceKeyAd, referenceKeyUserPurchased) {
        const auth = this.getAuthByToken(token);
        if (!!auth) {
            const primaryKeyAdsFind = this.ads.find((el) => {
                if (el.primaryKeyAd === referenceKeyAd) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind) {
                this.ads = this.ads.map((el) => {
                    if (el.primaryKeyAd === referenceKeyAd) {
                        return Object.assign(Object.assign({}, el), { referenceKeyUserPurchased: referenceKeyUserPurchased });
                    }
                    else {
                        return el;
                        console.log("nessun annuncio corrisponde alla tua ricerca");
                    }
                });
            }
            return true;
        }
        else
            return false;
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
    deleteReview: new docApi_1.DocAPI("/reviews/{primaryKReview}", "DELETE", true),
    addFavoutite: new docApi_1.DocAPI("/s", "POST", true),
    deleteFavourite: new docApi_1.DocAPI("/s/{primaryKeyFavourite}", "DELETE", true),
    getListPurchasedToBeConfirmedByUserPurchased: new docApi_1.DocAPI("ads/{primaryKeyAds}/purchased", "GET", true),
    markAsSold: new docApi_1.DocAPI("/ads/{primaryKeyAds}", "PATCH", true),
    getAuthByToken: new docApi_1.DocAPI("/auth", "GET", true),
    listFiltred: new docApi_1.DocAPI("/ads?category={category}", "GET", true), //da vedere meglio i query
};
