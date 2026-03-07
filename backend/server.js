import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", "local.env") });

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
