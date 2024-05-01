import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { postedBy, postText} = req.body;
    let { postImage } = req.body;
    

    

    if (!mongoose.Types.ObjectId.isValid(postedBy)) {
      return res.status(400).json({ error: "Invalid postedBy ID" });
    }

    if (!postedBy || !postText) {
      return res
        .status(400)
        .json({ error: "postedBy and postText fileds are required" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "Unauthorized user to create post" });
    }

    const maxLength = 500;
    if (postText.length > maxLength) {
      return res.status(400).json({
        error: `postText length must be less than ${maxLength} characters`,
      });
    }

    if(postImage){

      const response = await cloudinary.uploader.upload(postImage, {
        resource_type: "image",
      });
  
      postImage = response.secure_url
    }
    console.log(postImage);

    const newPost = new Post({
      postedBy,
      postText,
      postImage : postImage || ""
    });

    await newPost.save();

    res.status(200).json(newPost );
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while creating post: ", err.message);
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(  post );
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while get post: ", err.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }


    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "Unauthorized user cannot delete other user's post" });
    }

    if(post.postImage){
     
    await cloudinary.uploader.destroy(post.postImage.split("/").pop().split(".")[0]);
      
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted succesfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while deleting post: ", err.message);
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);

    if (!post) return res.status(400).json({ error: "Post not found" });

    const userLikedPost = post?.postLikes.includes(req.user?._id);

    if (userLikedPost) {
      post.postLikes.pull(req.user?._id);
    } else {
      post.postLikes.push(req.user?._id);
    }
    await post.save();

    res.status(200).json({
      message: userLikedPost
        ? "Post unliked successfully"
        : "Post liked successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while liking and unliking post: ", err.message);
  }
};

const repliesOnPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { repliesText } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    if (!repliesText) {
      return res
        .status(400)
        .json({ error: "Text filled should not be empty" });
    }

    let post = await Post.findById(postId);

    if (!post) return res.status(400).json({ error: "Post not found" });

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res
        .status(400)
        .json({ error: "User must be login for adding replies" });
    }


    const reply = {
      userId: user._id,
      repliesText: repliesText,
      userProfilePic: user.profilePic,
      username: user.username,
      
    }

    post.postReplies.push(reply);

    await post.save();

    res.status(200).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while replying post: ", err.message);
  }
};

// -- will work on this later when needed
// const deleteReplies = async (req, res) => {
//   try {
//     const { postId, replyId } = req.params;
//     console.log(replyId)

//     if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(replyId)) {
//       return res.status(400).json({ message: "Invalid post ID or reply ID" });
//     }

//     const post = await Post.findById(postId);

//     if (!post) return res.status(400).json({ message: "Post not found" });

//     if(post.postReplies.map((reply)=>reply._id.toString() !== replyId)){
//        return res.status(400).json({ message: "Reply not found" });

//     }

//     console.log(post.postReplies.map((reply)=>reply._id.toString()))
//     console.log(replyId)

//     const updatedPost = await Post.findByIdAndUpdate(
//       postId,
//       {
//         $pull: {
//           postReplies: { _id: new mongoose.Types.ObjectId(replyId) }
//         }
//       },
//       { new: true }
//     );

//     if (!updatedPost) {
//       return res.status(400).json({ message: "Post not found" });
//     }

//     res.status(200).json({ message: "Reply deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//     console.log("Error while deleting reply: ", err.message);
//   }
// };


  

const getFeedPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId); 

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;

    const feedPost = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    if (feedPost.length > 0) {
      res.status(200).json( feedPost );
    } else {
      return res.status(400).json({ error: "No post found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while getting feed post: ", err.message);
  }
};

const getUserPosts =async (req, res)=>{
  const{username} = req.params
  try {
    
    const user = await User.findOne({username})

    if(!user) {
      return  res.status(404).json({ error: "User not found" });
    }

    const userPosts = await Post.find({postedBy : user._id}).sort({createdAt: -1})

    if(!userPosts){
      return  res.status(404).json({ error: "Post not available" });

    }
    res.status(200).json(userPosts)
    
    
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
}

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  repliesOnPost,
  getFeedPost,
  getUserPosts
};
