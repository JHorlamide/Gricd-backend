import mongoose from "mongoose";

export const connectDatabase = async () => {
   try {
      const DB_URL = process.env.DB_URL;
      
      await mongoose.connect(DB_URL);
      console.log('DB connected successfully...')
   } catch (error) {
      console.log("Error connecting to DB ", error.message);
   }
}