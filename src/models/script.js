"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marketplace = void 0;
var user_1 = require("./src/models/user");
var ad_1 = require("./src/models/ad");
var review_1 = require("./src/models/review");
var auth_1 = require("./src/models/auth");
var favourite_1 = require("./src/models/favourite");
var docApi_1 = require("./src/models/docApi");
var Marketplace = /** @class */ (function () {
    function Marketplace() {
        this.users = [];
        this.ads = [];
        this.reviews = [];
        this.devices = [];
        this.auth = [];
        this.reports = [];
        this.favourites = [];
    }
    Marketplace.prototype.register = function (email, password) {
        var userFind = this.users.find(function (user) {
            if (user.email === email) {
                return true;
            }
            else {
                return false;
            }
        });
        if (!!userFind) {
            console.log("email gia esistente");
            return true;
        }
        else {
            var newUser = new user_1.User(email, password);
            this.users = __spreadArray(__spreadArray([], this.users, true), [newUser], false);
            console.log("registrazione effettuata con successo");
            return false;
        }
    };
    Marketplace.prototype.login = function (email, password) {
        var userFind = this.users.find(function (user) {
            if (user.email === email && user.password === password) {
                return true;
            }
            else {
                return false;
            }
        });
        if (!!userFind && this.devices.length <= 2) {
            var newAuth = new auth_1.Auth(userFind.primaryKeyUser);
            this.auth = __spreadArray(__spreadArray([], this.auth, true), [newAuth], false);
            return newAuth.token;
        }
        else {
            console.log("utente non registrato");
        }
    };
    Marketplace.prototype.logout = function (token) {
        var authFind = this.auth.find(function (el) {
            if (el.token === token) {
                return true;
            }
            else {
                return false;
            }
        });
        if (!!authFind) {
            this.auth = this.auth.filter(function (auth) {
                if (auth.token === token) {
                    return false;
                }
                else {
                    return true;
                }
            });
            console.log("logout effettuato con successo");
        }
        else {
            console.log("token non valido");
        }
    };
    Marketplace.prototype.deleteAccount = function (token, password) {
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var passwordFind = this.users.find(function (el) {
                if (el.password === password) {
                    return true;
                }
                else
                    return false;
            });
            if (!!passwordFind) {
                this.users = this.users.filter(function (el) {
                    if (el.password === password) {
                        return false;
                    }
                    else
                        return true;
                });
                console.log("eliminazione account avvenuta con successo");
            }
            else
                console.log("password non corretta");
        }
        else
            console.log("token non valido");
    };
    Marketplace.prototype.updateUsername = function (token, referenceKeyUser, newUsername) {
        // cambio nome
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var referenceKeyUserFind = this.auth.find(function (el) {
                if (el.referenceKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            if (!!referenceKeyUserFind) {
                this.users = this.users.map(function (el) {
                    if (el.primaryKeyUser === referenceKeyUser) {
                        return __assign(__assign({}, el), { username: newUsername });
                        console.log("cambio username effettuato");
                    }
                    else {
                        return el;
                        console.log("non è stato possibile effettuare il cambio dell'username");
                    }
                });
            }
        }
        else
            console.log("token errato");
    };
    Marketplace.prototype.createAds = function (token, referenceKeyUser, title, description, price, status, category, urlImage, address, referenceKeyUserPurchased) {
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var userFind = this.users.find(function (el) {
                if (el.primaryKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            if (!!userFind) {
                var newAds = new ad_1.Ad(title, description, price, status, referenceKeyUser, category, urlImage, address, referenceKeyUserPurchased, urlImage);
                this.ads = __spreadArray(__spreadArray([], this.ads, true), [newAds], false);
                console.log("annuncio creato con successo");
            }
            else {
                console.log("non è stato possibile creare l'annuncio");
            }
        }
        else {
            console.log("token non esiste");
        }
    };
    Marketplace.prototype.editAds = function (token, newTitle, newDescription, newPrice, newStatus, referenceKeyUser, primaryKeyAds, newCategory, newUrlForImage) {
        // modificare annuncio
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var referenceKeyUserFind = this.auth.find(function (el) {
                if (el.referenceKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            var primaryKeyAdsFind = this.ads.find(function (el) {
                if (el.primaryKeyAds === primaryKeyAds) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind && !!referenceKeyUserFind) {
                this.ads = this.ads.map(function (el) {
                    if (el.primaryKeyAds === primaryKeyAds &&
                        el.referenceKeyUser === referenceKeyUser) {
                        return __assign(__assign({}, el), { title: newTitle, description: newDescription, price: newPrice, status: newStatus, category: newCategory, urlForImage: newUrlForImage });
                    }
                    else
                        return el;
                });
            }
            else
                console.log("annuncio non trovato");
        }
        else
            console.log("token non valido");
    };
    Marketplace.prototype.deletetAds = function (token, primaryKeyAds) {
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var primaryKeyAdsFind = this.ads.find(function (el) {
                if (el.primaryKeyAds === primaryKeyAds) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind) {
                this.ads = this.ads.filter(function (el) {
                    if (el.primaryKeyAds === primaryKeyAds) {
                        return false;
                    }
                    else
                        return true;
                });
                console.log("eliminazione annuncio avvenuta con successo");
            }
            else
                console.log("non è stato possibile cancellare l'annuncio");
        }
        else
            console.log("token non valido");
    };
    Marketplace.prototype.createReview = function (token, referenceKeyUser, title, description, rating, referenceKeyAds) {
        //creare recensione
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var referenceKeyUserFind = this.auth.find(function (el) {
                if (el.referenceKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            var primaryKeyAdsFind = this.ads.find(function (el) {
                if (el.primaryKeyAds === referenceKeyAds) {
                    return true;
                }
                else
                    return false;
            });
            if (!!referenceKeyUserFind && !!primaryKeyAdsFind) {
                var newReview = new review_1.Review(referenceKeyUser, title, description, rating, referenceKeyAds);
                this.reviews = __spreadArray(__spreadArray([], this.reviews, true), [newReview], false);
            }
            else
                console.log("non è stato possibile creare la recensione");
        }
        else
            console.log("token non valido");
    };
    Marketplace.prototype.editReview = function (token, referenceKeyUser, title, description, rating, referenceKeyAds) {
        //modificare recensione
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var referenceKeyUserFind = this.auth.find(function (el) {
                if (el.referenceKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            var primaryKeyAdsFind = this.ads.find(function (el) {
                if (el.primaryKeyAds === referenceKeyAds) {
                    return true;
                }
                else
                    return false;
            });
            if (!!referenceKeyUserFind && !!primaryKeyAdsFind) {
                this.reviews = this.reviews.map(function (el) {
                    if (el.referenceKeyUser === referenceKeyUser &&
                        el.referenceKeyAds === referenceKeyAds) {
                        return __assign(__assign({}, el), { title: title, description: description, rating: rating });
                    }
                    else {
                        return el;
                        console.log("non è stato possibile modificare la recensione");
                    }
                });
            }
        }
        else
            console.log("token non valido");
    };
    Marketplace.prototype.deleteReview = function (token, referenceKeyUser, referenceKeyAds) {
        //eliminare recensione
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var referenceKeyUserFind = this.auth.find(function (el) {
                if (el.referenceKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            var primaryKeyAdsFind = this.ads.find(function (el) {
                if (el.primaryKeyAds === referenceKeyAds) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind) {
                this.reviews = this.reviews.filter(function (el) {
                    if (el.referenceKeyAds === referenceKeyAds &&
                        el.referenceKeyUser === referenceKeyUser) {
                        return false;
                    }
                    else
                        return true;
                });
                console.log("eliminazione review avvenuta con successo");
            }
            else
                console.log("ads sbagliato");
        }
        else
            console.log("token non valido");
    };
    Marketplace.prototype.createFavoutite = function (token, referenceKeyUser, referenceKeyAds) {
        var userAuth = this.getAuthByToken(token);
        if (!!userAuth) {
            var referenceKeyUserFind = this.auth.find(function (el) {
                if (el.referenceKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            var primaryKeyAdsFind = this.ads.find(function (el) {
                if (el.primaryKeyAds === referenceKeyAds) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind && !!referenceKeyUserFind) {
                var newFavourite = new favourite_1.Favourite(referenceKeyUser, referenceKeyAds);
                this.favourites = __spreadArray(__spreadArray([], this.favourites, true), [newFavourite], false);
                console.log("annuncio aggiunto ai preferiti");
            }
            else
                console.log("annuncio non aggiunto");
        }
        else {
            console.log("token non valido");
        }
    };
    Marketplace.prototype.deleteFavourite = function (token, referenceKeyAds, referenceKeyUser) {
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var referenceKeyUserFind = this.auth.find(function (el) {
                if (el.referenceKeyUser === referenceKeyUser) {
                    return true;
                }
                else
                    return false;
            });
            var primaryKeyAdsFind = this.ads.find(function (el) {
                if (el.primaryKeyAds === referenceKeyAds) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind && !!referenceKeyUserFind) {
                this.favourites = this.favourites.filter(function (el) {
                    if (el.referenceKeyUser === referenceKeyUser &&
                        el.referenceKeyAds === referenceKeyAds) {
                        return false;
                    }
                    else
                        return true;
                });
            }
        }
        else
            console.log("token non valido");
    };
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
    Marketplace.prototype.getAuthByToken = function (token) {
        var authFind = this.auth.find(function (el) {
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
    };
    Marketplace.prototype.listFiltredByCategory = function (token, category) {
        //lista filtrata
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var categoryFind = this.ads.find(function (el) {
                if (el.category === category) {
                    return true;
                }
                else
                    return false;
            });
            if (!!categoryFind) {
                return this.ads.filter(function (el) {
                    if (el.category === category) {
                        return true;
                    }
                    else
                        return false;
                });
            }
            else
                console.log("nessun annuncio per questa categoria");
        }
        else
            console.log("token non valido");
    };
    Marketplace.prototype.markAsSold = function (token, referenceKeyAds, referenceKeyUser) {
        var auth = this.getAuthByToken(token);
        if (!!auth) {
            var primaryKeyAdsFind = this.ads.find(function (el) {
                if (el.primaryKeyAds === referenceKeyAds) {
                    return true;
                }
                else
                    return false;
            });
            if (!!primaryKeyAdsFind) {
                this.ads = this.ads.map(function (el) {
                    if (el.primaryKeyAds === referenceKeyAds) {
                        return __assign(__assign({}, el), { referenceKeyUserPurchased: referenceKeyUser });
                    }
                    else {
                        return el;
                        console.log("nessun annuncio corrisponde alla tua ricerca");
                    }
                });
            }
        }
        else
            console.log("token non valido");
    };
    return Marketplace;
}());
exports.Marketplace = Marketplace;
var apis = {
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
