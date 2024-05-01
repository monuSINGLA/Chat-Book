import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { getRecipientSockertId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";



const sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    let { img } = req.body
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [ recipientId, senderId] },
    });

    if (!conversation) {
      // Create a new conversation if it doesn't exist
      conversation = new Conversation({
        participants: [recipientId, senderId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    if(img){
     const uploadedImage = await cloudinary.uploader.upload(img)
     img = uploadedImage.secure_url
    }
    console.log(img)

    // Add the message to the conversation
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    const recipientSockertId = getRecipientSockertId(recipientId)
    console.log("revied id",recipientSockertId)
    if(recipientSockertId){
      io.to(recipientSockertId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [otherUserId, userId] },
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    let conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic",
    });

    //remove the sender from the conversations
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });
    console.log(conversations)

    if(!conversations.length > 0) return res.status(200).json({error: "No conversations found"});
   
    

   res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};






export { sendMessage, getMessages, getConversations };
