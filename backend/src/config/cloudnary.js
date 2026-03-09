import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
) {
    console.error(
        "CRITICAL: Cloudinary environment variables are missing! CloudName: ",
        !!process.env.CLOUDINARY_CLOUD_NAME,
        " APIKey: ",
        !!process.env.CLOUDINARY_API_KEY,
        " APISecret: ",
        !!process.env.CLOUDINARY_API_SECRET,
    );
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const getDateFolder = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `uploads/${year}/${month}/${day}`;
};

const createStorage = (options = {}) => {
    try {
        return new CloudinaryStorage({
            cloudinary: cloudinary,
            params: async (req, file) => {
                const baseFolder = options.folder || "my-project-uploads";
                const dateFolder = getDateFolder();

                const timestamp = Date.now();
                const random = Math.random().toString(36).substring(2, 8);
                const originalName = (file.originalname || "upload")
                    .split(".")[0]
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .toLowerCase();

                return {
                    folder: `${baseFolder}/${dateFolder}`,
                    allowed_formats: options.allowedFormats || [
                        "jpg",
                        "jpeg",
                        "png",
                        "gif",
                        "webp",
                    ],
                    transformation: options.transformation || [
                        { quality: "auto", fetch_format: "auto" },
                    ],
                    public_id: `${originalName}-${timestamp}-${random}`,
                    resource_type: options.resourceType || "auto",
                };
            },
        });
    } catch (error) {
        console.error("Error creating Cloudinary storage:", error);
        throw error;
    }
};

const imageStorage = createStorage({
    folder: "images",
    allowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
        { width: 1920, height: 1080, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
    ],
});

const videoStorage = createStorage({
    folder: "videos",
    allowedFormats: ["mp4", "mov", "avi", "webm"],
    resourceType: "video",
});

const documentStorage = createStorage({
    folder: "documents",
    allowedFormats: ["pdf", "doc", "docx", "txt", "xls", "xlsx"],
});

export {
    cloudinary,
    createStorage,
    imageStorage,
    videoStorage,
    documentStorage,
    getDateFolder,
};
export default cloudinary;
