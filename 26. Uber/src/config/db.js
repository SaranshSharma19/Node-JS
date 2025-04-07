import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1); // Exit with failure code
    }
};