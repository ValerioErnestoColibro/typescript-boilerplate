import express, { Request, Response } from "express";
import { Marketplace } from "./script";

const { swaggerUi, swaggerSpec } = require("./swagger"); // Importa Swagger
const myApp = new Marketplace();
const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3000; //enviroment
const baseUrl = process.env.BASE_URL || "http://localhost:";

app.get("/", (req: Request, res: Response) => {
  return res.status(200).sendFile(__dirname + "/index.html"); // __dirname ottiene il percorso della cartella
});

// USERS

app.post("/api/auth/register", (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: "Email  o passwrod mancante" });
  }

  const success = myApp.register(email, password);

  if (success) {
    return res.status(200).json({
      message: "Utente registrato con successo",
      result: myApp.users,
    });
  } else {
    return res.status(400).json({ message: "Utente già registrato" });
  }
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const token = myApp.login(email, password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email o password sbagliate" });
  }

  if (token) {
    return res.status(200).json(token);
  } else return res.status(400).json({ message: "utente loggato" });
});

app.get("/api/auth/logout", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ messaggio: "logout non effettuato" });
  } else {
    const success = myApp.logout(Number(token));
    if (success) {
      return res
        .status(200)
        .json({ message: "logout effettuato con successo" });
    } else
      return res.status(400).json({ messaggio: "qualcosa non ha funzionato" });
  }
});

app.delete("/api/user/delete", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const password = req.body.password;
  const success = myApp.deleteAccount(Number(token), password);

  if (!password || !token) {
    return res.status(400).json({ messaggio: "token  o password errato" });
  }

  if (success) return res.status(200).json({ messaggio: "utente cancellato" });
  else return res.status(400).json({ messaggio: "utente non cancellato" });
});

app.patch(
  "/api/users/update-username/:primaryKeyUser",
  (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const primaryKeyUser = req.params.primaryKeyUser;
    const newUsername = req.body.newUsername;
    const users = myApp.users;
    const success = myApp.updateUsername(
      Number(token),
      primaryKeyUser,
      newUsername
    );

    if (!primaryKeyUser || !token) {
      return res.status(400).json({ messaggio: "token  o id errato" });
    } //

    if (success) {
      return res.status(200).json({
        message: "cambio username effettuato con successos",
        result: myApp.users,
      });
    } else return res.status(400).json({ message: "error" });
  }
);

// ADS
app.post("/api/ads", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const {
    title,
    description,
    price,
    status,
    referenceKeyUser,
    category,
    address,
    urlImage,
    referenceKeyUserPurchased,
  } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token errato" });
  }

  const success = myApp.createAd(
    Number(token),
    referenceKeyUser,
    title,
    description,
    price,
    status,
    category,
    address,
    urlImage,
    referenceKeyUserPurchased
  );

  if (success) {
    return res.status(200).json({
      message: "Annuncio creato con successo",
      result: myApp.ads, // Assicurati che l'array degli annunci venga restituito
    });
  } else {
    return res.status(400).json({ message: "Annuncio non creato" });
  }
});

app.put("/api/ads/update/:primaryKeyAd", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const {
    newTitle,
    newDescription,
    newPrice,
    newStatus,
    newCategory,
    newUrlImage,
  } = req.body;
  const primaryKeyAd = req.params.primaryKeyAd;
  const success = myApp.editAds(
    Number(token),
    newTitle,
    newDescription,
    newPrice,
    newStatus,
    Number(primaryKeyAd),
    newCategory,
    newUrlImage
  );
  const ads = myApp.ads;

  if (!token) {
    return res.status(400).json({ messagge: "token errato" });
  }

  if (success) {
    return res
      .status(200)
      .json({ messagge: "annuncio modificato con successo", result: ads });
  } else {
    return res.status(400).json({ messagge: "annuncio non modificato" });
  }
});

app.delete("/api/ads/delete/:primaryKeyAd", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const primaryKeyAd = req.params.primaryKeyAd;
  const success = myApp.deleteAds(Number(token), Number(primaryKeyAd));
  const ads = myApp.ads;
  if (!token) {
    return res.status(400).json({ messagge: "token errato" });
  }

  if (success) {
    return res
      .status(200)
      .json({ messagge: "annuncio cancellato con successo", result: ads });
  } else {
    return res.status(400).json({ messagge: "annuncio non cancellato" });
  }
});

app.get("/api/lists/categories", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const category = req.body.category;
  const ads = myApp.listFiltredByCategory(Number(token), category);
  const success = myApp.listFiltredByCategory(Number(token), category);
  if (!token) {
    return res.status(400).json({ messagge: "token errato" });
  }

  if (success) {
    return res
      .status(200)
      .json({ messagge: "annuncio filtrato per categoria", result: ads });
  } else {
    return res
      .status(400)
      .json({ messagge: "annuncio non filtrato per categoria" });
  }
});

app.patch(
  "/api/ads/update-ad-sold/:referenceKeyAd",
  (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const referenceKeyAd = req.params.referenceKeyAd;
    const referenceKeyUserPurchased = req.body.referenceKeyUserPurchased;
    const favourites = myApp.favourites;
    const success = myApp.markAsSold(
      Number(token),
      Number(referenceKeyAd),
      referenceKeyUserPurchased
    );
    if (!token) {
      return res.status(400).json({ messagge: "token errato" });
    }

    if (success) {
      return res.status(200).json({
        message: "annuncio marchiato",
        result: favourites,
      });
    } else {
      return res.status(400).json({ messagge: "annuncio non marchiato" });
    }
  }
);

// REVIEWS
app.post("/api/reviews", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const { referenceKeyUser, title, description, rating, referenceKeyAd } =
    req.body;
  const reviews = myApp.reviews;
  const success = myApp.createReview(
    Number(token),
    referenceKeyUser,
    title,
    description,
    rating,
    referenceKeyAd
  );
  if (!token) {
    return res.status(400).json({ messagge: "token errato" });
  }

  if (success) {
    return res
      .status(200)
      .json({ messagge: "recensione creata", result: reviews });
  } else {
    return res.status(400).json({ messagge: "recensione non creata" });
  }
});

app.put(
  "/api/reeviews/update/:primaryKeyReview",
  (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { newTitle, newDescription, newRating, referenceKeyAd } = req.body;
    const primaryKeyReview = req.params.primaryKeyReview;
    const reviews = myApp.reviews;
    const success = myApp.editReview(
      Number(token),
      Number(primaryKeyReview),
      newTitle,
      newDescription,
      newRating,
      referenceKeyAd
    );

    if (!token) {
      return res.status(400).json({ messagge: "token errato" });
    }

    if (success) {
      return res
        .status(200)
        .json({ messagge: "recensione modificata", resutlt: reviews });
    } else {
      return res.status(400).json({ messagge: "recensione non modificata" });
    }
  }
);

app.delete(
  "/api/reviews/delete/:primaryKeyReview",
  (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const primaryKeyReview = req.params.primaryKeyReview;
    const success = myApp.deleteReview(Number(token), Number(primaryKeyReview));
    const reviews = myApp.reviews;
    if (!token) {
      return res.status(400).json({ messagge: "token errato" });
    }
    if (success) {
      return res
        .status(200)
        .json({ messagge: "recensione eliminata", result: reviews });
    } else {
      return res.status(400).json({ messagge: "recensione non eliminata" });
    }
  }
);

// FAVOURITES
app.post("/api/favourites", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const { referenceKeyUser, referenceKeyAd } = req.body;
  const favourites = myApp.favourites;
  const success = myApp.createFavoutite(
    Number(token),
    referenceKeyAd,
    referenceKeyUser
  );
  if (!token) {
    return res.status(400).json({ messagge: "token errato" });
  }

  if (success) {
    return res
      .status(200)
      .json({ messagge: "annuncio aggiunto ai preferiti", result: favourites });
  } else {
    return res
      .status(400)
      .json({ messagge: "annuncio non aggiunto ai preferiti" });
  }
});

app.patch(
  "/api/favourites/remove/:referenceKeyAd",
  (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const referenceKeyAd = req.params.referenceKeyAd;
    const favourites = myApp.favourites;
    const success = myApp.deleteFavourite(
      Number(token),
      Number(referenceKeyAd)
    );
    if (!token) {
      return res.status(400).json({ messagge: "token errato" });
    }

    if (success) {
      return res.status(200).json({
        message: "annuncio rimosso dai preferiti",
        result: favourites,
      });
    } else {
      return res
        .status(400)
        .json({ messagge: "annuncio non rimosso dai preferiti" });
    }
  }
);

// LISTS

app.get("/api/lists/users", (req: Request, res: Response) => {
  const users = myApp.users;
  return res.status(200).json({ result: users });
});

app.get("/api/lists/ads", (req: Request, res: Response) => {
  const ads = myApp.ads;
  return res.status(200).json({ result: ads });
});

app.get("/api/lists/reviews", (req: Request, res: Response) => {
  const reviews = myApp.reviews;
  return res.status(200).json({ result: reviews });
});

app.get("/api/lists/favourites", (req: Request, res: Response) => {
  const favourites = myApp.favourites;
  return res.status(200).json({ result: favourites });
});

app.get("/api/lists/auth", (req: Request, res: Response) => {
  const auth = myApp.auth;
  return res.status(200).json({ result: auth });
});

/// fare in modo che i vari success siano dei boolean e
// controllare se l'url sia corretto e fare le funzioni di
//ritorno degli array

app.listen(port, () => {
  console.log(`Il server is running  on ${baseUrl}${port}`);
});
