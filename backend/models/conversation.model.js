import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [{ 
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    lastMessage: {
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      text: String,
      seen: {
        type: Boolean,
        default: false,
      }
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
