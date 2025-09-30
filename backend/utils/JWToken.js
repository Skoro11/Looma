import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export function RefreshTokenCreation(id, email) {
  const token = jwt.sign({ id: id, email: email }, process.env.REFRESH_TOKEN);
  return token;
}

export function TokenCreation(id, email) {
  const token = jwt.sign({ id: id, email: email }, process.env.JWT_SECRET);
  return token;
}

export function TokenVerification(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies.looma_token || (authHeader && authHeader.split(" ")[1]);
    console.log(token);
    if (!token) {
      console.log("No token");
      return res
        .status(401)
        .json({ error: "Access denied: No Token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
}
