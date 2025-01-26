import express from "express";
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from "../controllers/authController.js";
import { deleteMe, updateMe } from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-password", protect, updatePassword);
router.patch("/update-me", protect, updateMe);
router.delete("/delete-me", deleteMe);

export default router;
