import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "..", "..", "..", "local.env");
console.log("Loading env from:", envPath);
console.log("File exists:", fs.existsSync(envPath));

dotenv.config({ path: envPath });

console.log("Cloudinary Cloud Name loaded:", !!process.env.CLOUDINARY_CLOUD_NAME);
console.log("Cloudinary API Key loaded:", !!process.env.CLOUDINARY_API_KEY);
