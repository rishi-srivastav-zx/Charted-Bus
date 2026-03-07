import { Router } from "express";
import multer from "multer";
import cloudnaryConfig from "../config/cloudnary.js";

const router = Router();

const upload = multer({ storage: cloudnaryConfig.storage });

// Single file upload
router.post("/upload", upload.single("image"), (req, res) => {
    res.json({
        success: true,
        url: req.file.path,
        public_id: req.file.filename,
    });
});

// Multiple files upload
router.post("/upload-multiple", upload.array("images", 5), (req, res) => {
    const files = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
    }));
    res.json({ success: true, files });
});

export default router;
