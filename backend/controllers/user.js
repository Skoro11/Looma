import User from "../models/User.js";
import { RefreshTokenCreation, TokenCreation } from "../utils/JWToken.js";
import { HashPassword, ComparePasswords } from "../utils/Bcrypt.js";
export async function RegisterUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        code: "MISSING_FIELDS",
        message: "There are missing fields",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        code: "EMAIL_IN_USE",
        message: "Email already in use",
      });
    }
    const hashedPassword = await HashPassword(password);

    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      code: "USER_REGISTERED",
      message: "User registered",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "Something went wrong while registering",
      errorMessage: error.message,
    });
  }
}

export async function LoginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        code: "MISSING_FIELDS",
        message: "There are missing fields",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const userDbPassword = user.password;

    //Checks hashed password with the plain text password

    const isPasswordCorrrect = await ComparePasswords(password, userDbPassword);
    if (!isPasswordCorrrect) {
      return res.status(401).json({
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });
    } else {
      const accessToken = TokenCreation(user._id, user.email, user.username);
      res.cookie("looma_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1500 * 60 * 1000,
      });

      /* Adds refresh Token to the user object */
      const refreshToken = RefreshTokenCreation(user._id, user.email);
      user.refreshToken = refreshToken;
      await user.save();
      return res.status(200).json({
        success: true,
        code: "LOGIN_SUCCESS",
        message: "Logged in successfully",
        data: {
          user: { _id: user._id, email: user.email, username: user.username },
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "Something went wrong while logging in",
      errorMessage: error.message,
    });
  }
}

export async function GetAllOtherUsers(req, res) {
  try {
    const { id } = req.user;
    /* console.log("User id", id); */
    const allUsers = await User.find({});
    /*  console.log("All Users", allUsers); */
    const filteredUsers = allUsers.filter(
      (user) => user._id.toString() !== id.toString()
    );
    /* console.log(filteredUsers); */
    res.json({ users: filteredUsers });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
}

export async function AddFriend(req, res) {
  try {
    const { id } = req.user;
    const { friendId } = req.body;
    const user = await User.findById(id);

    const existingFriend = user.friends.includes(friendId);
    const usernameFriend = await User.findById(friendId);
    const username = usernameFriend.username;
    console.log("Username friend", username);
    if (!existingFriend) {
      user.friends.push(friendId);
      await user.save();
      res.status(201).json({
        success: true,
        newFriend: { _id: friendId, username: username },
      });
    } else {
      res.status(200).json({ success: true, message: "Friend already exists" });
    }
  } catch (error) {
    console.log("Error with adding friend ", error.message);
  }
}

export async function RemoveFriend(req, res) {
  try {
    const { id } = req.params;
    const friendId = id;
    const user = req.user;

    const findUser = await User.findById(user.id);
    const friend = await User.findById(friendId);
    const removedFriend = findUser.friends.find(
      (friend) => friend._id.toString() === friendId
    );

    if (!removedFriend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    findUser.friends = findUser.friends.filter(
      (friend) => friend._id != friendId
    );

    await findUser.save();
    res.status(200).json({
      success: true,
      removedFriend: { id: removedFriend, username: friend.username },
    });
  } catch (error) {
    console.log("Error with RemoveFriend ", error.message);
  }
}

export async function GetFriends(req, res) {
  try {
    const { id } = req.user;

    const user = await User.findById(id).populate("friends", "username _id");
    const userFriends = user.friends;

    console.log("User ID", userFriends);
    res.status(200).json({ userFriends: userFriends });
  } catch (error) {
    console.log("Error with getting friend", error.message);
  }
}
