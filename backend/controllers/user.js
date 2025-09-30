import User from "../models/User.js";
import { RefreshTokenCreation, TokenCreation } from "../utils/JWToken.js";
import { HashPassword, ComparePasswords } from "../utils/Bcrypt.js";
export async function RegisterUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await HashPassword(password);

    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ registeredUser: newUser });
  } catch (error) {
    console.log("Error RegisterUser ", error.message);
    res.status(500).json({ errorMessage: error.message });
  }
}

export async function LoginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const userDbPassword = user.password;

    //Checks hashed password with the plain text password

    const isPasswordCorrrect = await ComparePasswords(password, userDbPassword);
    if (!isPasswordCorrrect) {
      return res.status(401).json({ message: "Invalid Credentials" });
    } else {
      const accessToken = TokenCreation(user._id, user.email);
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
        message: "Logged in",
        user: { _id: user._id, email: user.email, username: user.username },
      });
    }
  } catch (error) {
    res.status(500).json({ errorLoginUser: error.message });
  }
}

export async function GetAllUsers(req, res) {
  try {
    const allUsers = await User.find({});
    res.json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
}
