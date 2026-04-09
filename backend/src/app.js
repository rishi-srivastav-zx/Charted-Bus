import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authroutes.js";
import userRoutes from "./routes/userroutes.js";
import busRoutes from "./routes/busroutes.js";
import uploadRoutes from "./routes/uploads.js";
import bookingRoutes from "./routes/bookingroutes.js";
import charterBusRoutes from "./routes/seoroutes.js";   

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "Authorization",
            "Cache-Control",
            "Pragma",
        ],
    }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/charter-bus", charterBusRoutes);  

export default app;
