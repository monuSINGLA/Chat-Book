import express from "express";
import {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  repliesOnPost,
  getFeedPost,
  getUserPosts
} from "../controllers/post.controller.js";
import verifyToken from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get("/feed", verifyToken, getFeedPost);
router.get("/:id", verifyToken, getPost);
router.get("/user/:username", verifyToken, getUserPosts);
router.post("/create", verifyToken, createPost);
router.delete("/:id", verifyToken, deletePost);
router.put("/like/:id", verifyToken, likeUnlikePost);
router.put("/replies/:id", verifyToken, repliesOnPost);

// ---wiil do work on it later when needed
// router.delete("/replies/:postId/:replyId", verifyToken, deleteReplies)

export default router;
