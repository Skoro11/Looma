import express from "express";
import { TokenVerification } from "../utils/JWToken.js";
import { LoginUser, RegisterUser } from "../controllers/user.js";
const router = express.Router();

/*  
POST /auth/register
Registers a new user */
router.post("/register", RegisterUser);

/* POST /auth/login
Logins an existing user and gives back "looma" token with a value inside of cookies  */
router.post("/login", LoginUser);

/* GET /auth/me
Returns the user information from token */
router.get("/me", TokenVerification, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
