import express from "express";
import {
  AddFriend,
  GetAllOtherUsers,
  GetFriends,
  RemoveFriend,
} from "../controllers/user.js";
const router = express.Router();
import { TokenVerification } from "../utils/JWToken.js";

/* GET /user/others 
Retrieves all users except the current authenticated user (Gets authenticated user ID from token)*/
router.get("/others", TokenVerification, GetAllOtherUsers);

/* POST /user/friends
Adds a new friend to a user */
router.post("/friends/add", TokenVerification, AddFriend);
export default router;

/* DELETE /user/friends/remove/{:id}
Remove friend from identified user */
router.delete("/friends/remove/:id", TokenVerification, RemoveFriend);

/* GET /user/friends/all
Get all friends from the user */
router.get("/friends/all", TokenVerification, GetFriends);
