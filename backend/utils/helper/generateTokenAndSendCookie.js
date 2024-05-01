import jwt from "jsonwebtoken";

const generateTokenAndSendCookie = async (userId, res) => {
  try {
    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    // Set cookie in the response
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // Convert days to milliseconds
      sameSite: "strict",
      // Add other cookie options as needed (e.g., secure: true)
    });
    return token;
  } catch (error) {
    console.error("Error generating JWT token:", error);
  }
};

export default generateTokenAndSendCookie;
