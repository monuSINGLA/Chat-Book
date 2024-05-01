import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSendCookie from "../utils/helper/generateTokenAndSendCookie.js";
import uploadOnCloudinary from "../utils/helper/cloudinary.js";
import mongoose from "mongoose";
import Post from "../models/post.model.js";


const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (
      [name, username, email, password].some((filed) => filed.trim() === "")
    ) {
      return res.status(400).json({ error: "All fileds are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be 8 characters or more" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      await generateTokenAndSendCookie(newUser._id, res);

      res.status(200).json({
        userData: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email.trim(),
          username: newUser.username.trim(),
          bio: newUser.bio,
          profilePic: newUser.profilePic,
        },
        message: "User registered successfully",
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while creating user in signupUser: ", err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).json({ error: "All fileds are required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }

    await generateTokenAndSendCookie(user._id, res);

    if(user.isFrozen){
      user.isFrozen = false;
      await user.save()
    }

    res.status(200).json({
      success: true,
      userData: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profilePic: user.profilePic,
      },
      message: "User login successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while login user: ", err.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logout successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while logout user: ", err.message);
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(req.user?._id);

    if (req.user && req.user._id.toString() === id) {
      console.log("you cannot follow yourself");
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });
    }

    if (!userToFollow || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    console.log(isFollowing);

    if (isFollowing) {
      // do unfollow in case user followed userId
      currentUser.following.pull(id);
      userToFollow.followers.pull(currentUser._id);
    } else {
      // do follow in case user unfollowed userId
      currentUser.following.push(id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      message: isFollowing
        ? "User unfollwed successfully"
        : "User follwed successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while Follow and Unfollow user: ", err.message);
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;

  const userId = req.user._id;

 

  try {
    if (userId.toString() !== req.params.id) {
      console.log("you cannot update other users profile");
      return res.status(400).json({ error: "You cannot update other users" });
    }

    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    const imgUrl = await uploadOnCloudinary(user, profilePic);
   

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = imgUrl || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    // for update user comments latest infromation when profile updated
    await Post.updateMany(
      { "postReplies.userId": userId }, // Find posts with replies by the user
      {
        $set: {
          "postReplies.$[reply].username": user.username,
          "postReplies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] } // Filter to update specific replies
    );

    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while Updating user: ", err.message);
  }
};

const getUserProfile = async (req, res) => {
  const { query } = req.params;

  try {
    let user;

    const isValidObjectId = mongoose.Types.ObjectId.isValid(query);

    if (isValidObjectId) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error while getting user profile: ", err.message);
  }
};


const getSuggestedUsers = async (req, res) => {
  try {
   const userId = req.user._id

   const usersFollowedByYou = await User.findById(userId).select("following")
   
   const users = await User.aggregate([
    {
      $match: {
        _id: {
          $ne: userId
        }
      }
    },
      {
        $sample: {
          size: 10
        }
      }
    ])

  const filterUsers = users.filter((user)=> !usersFollowedByYou.following.includes(user._id))
    const suggestedUsers = filterUsers.slice(0,5)

    suggestedUsers.forEach(user => user.password = null)

  
    res.status(200).json(suggestedUsers)

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error while getting suggested users: ", error.message);
  }
}

const freezeAccount = async (req, res) =>{
try {
  const userId = req.user._id

  const user = await User.findById(userId)

  if(!user){
    return res.status(400).json({ error: "user not find" });

  }

  user.isFrozen = true
  await user.save()

  res.status(200).json({success: true})

} catch (error) {
  res.status(500).json({ error: error.message });
  
}
}

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount
};
