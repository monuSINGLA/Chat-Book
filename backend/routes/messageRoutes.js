import express from "express";
import {sendMessage, getMessages, getConversations} from "../controllers/message.controller.js";
import verifyToken from "../middleware/protectRoute.middleware.js";


const router = express.Router();

router.get("/conversations", verifyToken, getConversations);
router.post("/",verifyToken, sendMessage)
router.get("/:otherUserId",verifyToken, getMessages)

export default router;