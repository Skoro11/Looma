import express from "express";
import { GetAllOtherUsers } from "../controllers/user.js";
const router = express.Router();
import { TokenVerification } from "../utils/JWToken.js";
//Have Token attached

/* GET /user/others 
Retrieves all users except the current authenticated user (Gets authenticated user ID from token)*/
router.get("/others", TokenVerification, GetAllOtherUsers);

export default router;
