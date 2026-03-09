import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
