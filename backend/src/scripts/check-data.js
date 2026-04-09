import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "..", "..", "..", "local.env");
dotenv.config({ path: envPath });

import CharterBusPage from "../models/seoSchema.js";
import Bus from "../models/busmodel.js";

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const allPages = await CharterBusPage.countDocuments({});
        const activePages = await CharterBusPage.countDocuments({ isDeleted: false });
        const deletedPages = await CharterBusPage.countDocuments({ isDeleted: true });

        const allBuses = await Bus.countDocuments({});
        const activeBuses = await Bus.countDocuments({ isDeleted: false });

        console.log("TOTAL PAGES:", allPages);
        console.log("ACTIVE PAGES (isDeleted: false):", activePages);
        console.log("DELETED PAGES (isDeleted: true):", deletedPages);
        
        console.log("TOTAL BUSES:", allBuses);
        console.log("ACTIVE BUSES:", activeBuses);

        const samplePage = await CharterBusPage.findOne({});
        console.log("SAMPLE PAGE:", JSON.stringify(samplePage, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
