import jwt, { decode } from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

export const protectedMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid token!");
    }
  } else {
    res.status(401);
    throw new Error("Token not found!");
  }
});

export const ownerMiddleware = (req, res, next) => {
  if (req.user && req.user.role == "owner") {
    next();
  } else {
    res.status(401);
    throw new Error("Tidak diizinkan melakukan tindakan ini!");
  }
};
