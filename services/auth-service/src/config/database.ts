import "dotenv/config"
import mongoose from "mongoose";

export const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI as string)
        console.log("connect database successfully")
    } catch (error) {
        console.log("Cannot start the database:", error)
        process.exit(1);

    }
}