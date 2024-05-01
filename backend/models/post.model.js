import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postText: {
      type: String,
      maxLength: 500,
    },

    postImage: {
      type: String,
    },
    postLikes: {
      type : [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: []
    },
    postReplies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        repliesText: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
        },
        
      
        
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
