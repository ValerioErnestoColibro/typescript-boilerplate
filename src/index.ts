import express, { Request, Response } from "express";
import { Marketplace } from "./script";
import { Auth } from "./models/auth";
import { User } from "./models/user";

const myApp = new Marketplace();
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000; //enviroment
const baseUrl = process.env.BASE_URL || "http://localhost:";

app.get("/", (req: Request, res: Response) => {
  return res.status(200).sendFile(__dirname + "/index.html"); // __dirname ottiene il percorso della cartella
});

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
  }
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

app.post("/api/user/delete", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const password = req.body.password;
  const success = myApp.deleteAccount(Number(token), password);

  if (!password || !token) {
    return res.status(400).json({ messaggio: "token  o password errato" });
  }

  if (success) return res.status(200).json({ messaggio: "utente cancellato" });
  else return res.status(400).json({ messaggio: "utente non cancellato" });
});

app.listen(port, () => {
  console.log(`Il server is running  on ${baseUrl}${port}`);
});

/// fare in modo che i vari success siano dei boolean e
// controllare se l'url sia corretto e fare le funzioni di
//ritorno degli array
