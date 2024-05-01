import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });
  
  const uploadOnCloudinary = async (user, base64Image) => {
    try {
      if (!base64Image) return null;
  
     
      
  
      if (user.profilePic) {
        // If the user already has a profile picture, delete it from Cloudinary
        await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
      }
  
      // Upload the decoded image data to Cloudinary
      const response = await cloudinary.uploader.upload(base64Image, {
        resource_type: "image",
      });
  
      // Extract the secure URL of the uploaded image from the response
      const imageUrl = response.secure_url;
  
      return imageUrl;
    } catch (error) {
      console.error("Error while uploading image to Cloudinary:", error);
      return null;
    }
  };
  
  export default uploadOnCloudinary;