import express, { Request, Response } from "express";
import { Marketplace } from "./script";
import { Auth } from "../../../typescript/src/models/auth";
import { User } from "./user";

const myApp = new Marketplace();
const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.status(200).sendFile(__dirname + "/index.html"); // __dirname ottiene il percorso della cartella
});

app.post("/api/auth/register", (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  const success = myApp.register(email, password);
  if (!email) {
    return res.status(400).json({ message: "Email mancante" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password mancante" });
  }
  if (success) {
    return res.status(400).json({
      message: "Utente registrato con successo",
    });
  } else if (email === email && password === password) {
    return res.status(200).json({ message: "Utente già registrato" });
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
    return res.status(200).json({ code: token });
  }
});

app.put("/api/auth/logout", (req: Request, res: Response) => {});
app.listen(3000, () =>
  console.log("Il server is running  on http://localhost:3000")
);
