import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "..", "..", "..", "local.env");
dotenv.config({ path: envPath });

import User from "../models/user.js";
import Bus from "../models/busmodel.js";
import Booking from "../models/booking.js";
import CharterBusPage from "../models/seoSchema.js";

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        console.log("Migrating Users...");
        const userRes = await User.updateMany(
            { isDeleted: { $exists: false } },
            { $set: { isDeleted: false, deletedAt: null } }
        );
        console.log(`Users updated: ${userRes.modifiedCount}`);

        console.log("Migrating Buses...");
        const busRes = await Bus.updateMany(
            { isDeleted: { $exists: false } },
            { $set: { isDeleted: false, deletedAt: null } }
        );
        console.log(`Buses updated: ${busRes.modifiedCount}`);

        console.log("Migrating Bookings...");
        const bookingRes = await Booking.updateMany(
            { isDeleted: { $exists: false } },
            { $set: { isDeleted: false, deletedAt: null } }
        );
        console.log(`Bookings updated: ${bookingRes.modifiedCount}`);

        console.log("Migrating SEO Pages...");
        const seoRes = await CharterBusPage.updateMany(
            { isDeleted: { $exists: false } },
            { $set: { isDeleted: false, deletedAt: null } }
        );
        console.log(`SEO Pages updated: ${seoRes.modifiedCount}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
