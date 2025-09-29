import express from "express";
import { DbConnection } from "./config/DbConnection.js";
import dotenv from "dotenv";
import { RegisterUser } from "./controllers/user.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("This is the backend");
});

app.post("/api/auth/register", RegisterUser);

app.listen(3000, () => {
  async function StartServer() {
    const connection = await DbConnection(process.env.MONGODB_URI);
    if (connection === true) {
      console.log("App is listening on port 3000");
    }
  }
  StartServer();
});
