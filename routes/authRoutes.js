import express from "express";
import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateUser,
} from "../controllers/authController.js";
import { protectedMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.post(
//   "/register",
//   asyncHandler(async (req, res) => {
//     await User.create({
//       name: req.body.name,
//     });
//   })
// );

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", protectedMiddleware, logoutUser);

router.get("/getuser", protectedMiddleware, getCurrentUser);

router.put("/update-user/:id", updateUser);

export default router;
