import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJwt = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // Extract token either from cookie or from Authorization header
    const token =
      req.cookies?.token || // 👈 Match the cookie name you set in login/register
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized request" });
    }

    // Verify token using the correct environment variable name
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECREAT);

    // Find user based on decoded ID
    const user = await User.findById(decoded?.id).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid access token" });
    }

    // Attach user data to request
    req.user = user;

    next(); // ✅ proceed to next middleware/controller
  } catch (error) {
    console.error("JWT Auth Error:", error?.message);

    // Handle expired/invalid token errors more clearly
    const message =
      error.name === "TokenExpiredError"
        ? "Access token expired"
        : "Invalid or malformed token";

    return res.status(401).json({ success: false, message });
  }
};
