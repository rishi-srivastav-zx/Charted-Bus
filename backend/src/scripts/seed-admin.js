import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "..", "..", "..", "local.env");
dotenv.config({ path: envPath });

const ADMIN_EMAIL = "charteradmin4343@gmail.com";
const ADMIN_PASSWORD = "Charter@1234";

async function seedAdmin() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in local.env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Check if a superadmin already exists
        let admin = await User.findOne({ role: "superadmin", isDeleted: false });

        if (admin) {
            console.log("Updating existing Super Admin...");
            admin.email = ADMIN_EMAIL;
            admin.password = ADMIN_PASSWORD;
            // Ensure all permissions are granted
            admin.permissions = [
                "users:manage",
                "users:view",
                "buses:manage",
                "buses:view",
                "routes:manage",
                "routes:view",
                "bookings:manage",
                "bookings:view",
                "payments:manage",
                "payments:view",
                "reports:view",
                "reports:manage",
                "settings:manage",
                "system:admin",
            ];
            await admin.save();
            console.log("Super Admin updated successfully!");
        } else {
            console.log("Creating new Super Admin...");
            admin = await User.create({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                firstName: "Admin",
                role: "superadmin",
                permissions: [
                    "users:manage",
                    "users:view",
                    "buses:manage",
                    "buses:view",
                    "routes:manage",
                    "routes:view",
                    "bookings:manage",
                    "bookings:view",
                    "payments:manage",
                    "payments:view",
                    "reports:view",
                    "reports:manage",
                    "settings:manage",
                    "system:admin",
                ],
                emailVerified: true,
                isActive: true
            });
            console.log("Super Admin created successfully!");
        }

        console.log("New Credentials:");
        console.log("Email:", ADMIN_EMAIL);
        console.log("Password:", ADMIN_PASSWORD);

        process.exit(0);
    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
}

seedAdmin();
