import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import captainRoutes from "./routes/captainRoutes.js"
import mapsRoutes from "./routes/mapRoutes.js"

dotenv.config()

const app = express()

connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/captain", captainRoutes);
app.use("/api/v1/maps", mapsRoutes);
// app.use("/api/v1/rides", rideRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Uber backend API' });
});


export default app;