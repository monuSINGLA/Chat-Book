import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_URL, {
      //to avoid warnings in console
      // useNewUrlParser:true,
      // useUnifiedTopology:true,
      // useCreateIndex:true
    });
    console.log(`MongoDB connected: ${connection.connection.host} `);
  } catch (error) {
    console.log(
      "Connection failed while connecting to MongoDB Database \n",
      error.message
    );
  }
};

export default connectDB;
