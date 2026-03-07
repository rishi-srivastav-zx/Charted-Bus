import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authroutes.js";
import userRoutes from "./routes/userroutes.js";
import uploadRoutes from "./routes/uploads.js";
import busRoutes from "./routes/busroutes.js";


const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
    
app.use("/api", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/buses", busRoutes); 

export default app;