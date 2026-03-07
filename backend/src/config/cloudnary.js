import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Configure Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "my-project-uploads",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "mp4"],
        transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
});

export default { cloudinary, storage };
