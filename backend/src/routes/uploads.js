import { Router } from "express";
import multer from "multer";
import {
    imageStorage,
    videoStorage,
    documentStorage,
    createStorage,
} from "../config/cloudnary.js";
import CloudinaryController from "../controllers/cloudinaryController.js";

const router = Router();

const createFileFilter = (allowedTypes) => (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
            ),
            false,
        );
    }
};

const imageUpload = multer({
    storage: imageStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: createFileFilter([
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
    ]),
});

const videoUpload = multer({
    storage: videoStorage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: createFileFilter([
        "video/mp4",
        "video/quicktime",
        "video/webm",
    ]),
});

const documentUpload = multer({
    storage: documentStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

const anyUpload = multer({
    storage: createStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});

router.post(
    "/upload/image",
    imageUpload.single("image"),
    CloudinaryController.uploadSingle,
);

router.post(
    "/upload/images",
    imageUpload.array("images", 10),
    CloudinaryController.uploadMultiple,
);

router.post(
    "/upload/video",
    videoUpload.single("video"),
    CloudinaryController.uploadSingle,
);

router.post(
    "/upload/document",
    documentUpload.single("document"),
    CloudinaryController.uploadSingle,
);

router.post(
    "/upload",
    anyUpload.single("file"),
    CloudinaryController.uploadSingle,
);

router.post(
    "/upload-multiple",
    anyUpload.array("files", 10),
    CloudinaryController.uploadMultiple,
);

router.delete("/file/:publicId", CloudinaryController.deleteFile);
router.post("/files/delete", CloudinaryController.deleteMultiple);
router.get("/file/:publicId", CloudinaryController.getFileDetails);
router.put(
    "/file/:publicId",
    imageUpload.single("image"),
    CloudinaryController.updateFile,
);

router.get("/files", CloudinaryController.listFiles);
router.get("/files/stats", CloudinaryController.getUploadStats);

router.post("/signature", CloudinaryController.generateSignature);

router.use((error, req, res, next) => {
    console.error("Upload error caught in middleware:", error);
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File too large",
            });
        }
    }
    res.status(500).json({
        success: false,
        message: error.message || "Upload error",
    });
});

export default router;
