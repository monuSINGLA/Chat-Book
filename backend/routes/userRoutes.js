import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/protectRoute.middleware.js";

const router = express.Router();




router.get("/profile/:query", getUserProfile);
router.get("/suggested", verifyToken, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.post("/follow/:id", verifyToken, followUnfollowUser);
router.put("/update/:id", verifyToken, updateUser);
router.put("/freeze", verifyToken, freezeAccount);

export default router;
