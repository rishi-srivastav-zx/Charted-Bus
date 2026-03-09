import { getDateFolder, cloudinary } from "../config/cloudnary.js";

class CloudinaryController {
    static uploadSingle = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file provided",
                });
            }

            const file = req.file;

            if (!file.path) {
                throw new Error(
                    "Cloudinary did not return a file path. Check your storage configuration.",
                );
            }

            res.status(201).json({
                success: true,
                message: "File uploaded successfully",
                data: {
                    url: file.path,
                    secureUrl: (file.path || "").replace("http://", "https://"),
                    publicId: file.filename,
                    folder:
                        file.folder ||
                        (typeof getDateFolder === "function"
                            ? getDateFolder()
                            : ""),
                    originalName: file.originalname,
                    size: file.size,
                    format: file.format,
                    resourceType: file.resource_type,
                    createdAt: new Date().toISOString(),
                },
            });
        } catch (error) {
            console.error("Upload controller error:", error);
            res.status(500).json({
                success: false,
                message: "Upload failed at controller level",
                error: error.message,
                stack:
                    process.env.NODE_ENV === "development"
                        ? error.stack
                        : undefined,
            });
        }
    };

    static uploadMultiple = async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No files provided",
                });
            }

            const files = req.files.map((file) => ({
                url: file.path,
                secureUrl: file.path.replace("http://", "https://"),
                publicId: file.filename,
                folder: file.folder || getDateFolder(),
                originalName: file.originalname,
                size: file.size,
                format: file.format,
                resourceType: file.resource_type,
            }));

            res.status(201).json({
                success: true,
                message: `${files.length} files uploaded successfully`,
                count: files.length,
                data: files,
                uploadedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Multiple upload error:", error);
            res.status(500).json({
                success: false,
                message: "Upload failed",
                error: error.message,
            });
        }
    };

    static deleteFile = async (req, res) => {
        try {
            const { publicId } = req.params;

            if (!publicId) {
                return res.status(400).json({
                    success: false,
                    message: "Public ID is required",
                });
            }

            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: req.query.resourceType || "image",
            });

            if (result.result === "ok") {
                res.json({
                    success: true,
                    message: "File deleted successfully",
                    data: {
                        publicId,
                        deletedAt: new Date().toISOString(),
                    },
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Failed to delete file",
                    result,
                });
            }
        } catch (error) {
            console.error("Delete error:", error);
            res.status(500).json({
                success: false,
                message: "Delete failed",
                error: error.message,
            });
        }
    };

    static deleteMultiple = async (req, res) => {
        try {
            const { publicIds } = req.body;

            if (!Array.isArray(publicIds) || publicIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Array of public IDs is required",
                });
            }

            const deletePromises = publicIds.map((id) =>
                cloudinary.uploader.destroy(id, {
                    resource_type: req.body.resourceType || "image",
                }),
            );

            const results = await Promise.all(deletePromises);
            const successCount = results.filter(
                (r) => r.result === "ok",
            ).length;

            res.json({
                success: true,
                message: `${successCount}/${publicIds.length} files deleted`,
                data: {
                    total: publicIds.length,
                    deleted: successCount,
                    failed: publicIds.length - successCount,
                    results: publicIds.map((id, index) => ({
                        publicId: id,
                        status: results[index].result,
                    })),
                    deletedAt: new Date().toISOString(),
                },
            });
        } catch (error) {
            console.error("Bulk delete error:", error);
            res.status(500).json({
                success: false,
                message: "Bulk delete failed",
                error: error.message,
            });
        }
    };

    static getFileDetails = async (req, res) => {
        try {
            const { publicId } = req.params;

            const result = await cloudinary.api.resource(publicId, {
                resource_type: req.query.resourceType || "image",
            });

            res.json({
                success: true,
                data: {
                    publicId: result.public_id,
                    url: result.secure_url,
                    format: result.format,
                    size: result.bytes,
                    width: result.width,
                    height: result.height,
                    createdAt: result.created_at,
                    folder: result.folder,
                    tags: result.tags,
                    resourceType: result.resource_type,
                },
            });
        } catch (error) {
            console.error("Get details error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get file details",
                error: error.message,
            });
        }
    };

    static listFiles = async (req, res) => {
        try {
            const {
                folder,
                year = new Date().getFullYear(),
                month,
                day,
                maxResults = 100,
                nextCursor,
            } = req.query;

            let searchFolder = folder;
            if (!searchFolder && year) {
                searchFolder = `uploads/${year}`;
                if (month) searchFolder += `/${String(month).padStart(2, "0")}`;
                if (day) searchFolder += `/${String(day).padStart(2, "0")}`;
            }

            const options = {
                type: "upload",
                max_results: parseInt(maxResults),
                ...(searchFolder && { prefix: searchFolder }),
                ...(nextCursor && { next_cursor: nextCursor }),
            };

            const result = await cloudinary.api.resources(options);

            res.json({
                success: true,
                count: result.resources.length,
                data: result.resources.map((resource) => ({
                    publicId: resource.public_id,
                    url: resource.secure_url,
                    format: resource.format,
                    size: resource.bytes,
                    width: resource.width,
                    height: resource.height,
                    createdAt: resource.created_at,
                    folder: resource.folder,
                    resourceType: resource.resource_type,
                })),
                pagination: {
                    nextCursor: result.next_cursor,
                    total: result.total_count,
                },
            });
        } catch (error) {
            console.error("List files error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to list files",
                error: error.message,
            });
        }
    };

    static getUploadStats = async (req, res) => {
        try {
            const { year = new Date().getFullYear() } = req.query;

            const result = await cloudinary.api.resources({
                type: "upload",
                prefix: `uploads/${year}`,
                max_results: 500,
            });

            const stats = result.resources.reduce((acc, resource) => {
                const date = resource.created_at.split("T")[0];
                if (!acc[date]) {
                    acc[date] = { count: 0, totalSize: 0 };
                }
                acc[date].count += 1;
                acc[date].totalSize += resource.bytes;
                return acc;
            }, {});

            res.json({
                success: true,
                year,
                data: Object.entries(stats).map(([date, data]) => ({
                    date,
                    count: data.count,
                    totalSize: data.totalSize,
                    totalSizeFormatted: this.formatBytes(data.totalSize),
                })),
            });
        } catch (error) {
            console.error("Stats error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get upload statistics",
                error: error.message,
            });
        }
    };

    static updateFile = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No new file provided",
                });
            }

            const { publicId } = req.params;

            await cloudinary.uploader.destroy(publicId, {
                resource_type: req.body.resourceType || "image",
            });

            // Safely handle missing file.path for the new file
            if (!req.file.path) {
                return res.status(500).json({
                    success: false,
                    message:
                        "New uploaded file object is missing 'path' property. This indicates an issue with the upload process.",
                    fileDetails: {
                        filename: req.file.filename,
                        originalname: req.file.originalname,
                        size: req.file.size,
                        mimetype: req.file.mimetype,
                    },
                });
            }

            res.status(200).json({
                success: true,
                message: "File updated successfully",
                data: {
                    oldPublicId: publicId,
                    newUrl: req.file.path,
                    newPublicId: req.file.filename,
                    updatedAt: new Date().toISOString(),
                },
            });
        } catch (error) {
            console.error("Update error:", error);
            res.status(500).json({
                success: false,
                message: "Update failed",
                error: error.message,
            });
        }
    };

    static generateSignature = async (req, res) => {
        try {
            const timestamp = Math.round(new Date().getTime() / 1000);
            const folder = `${req.body.folder || "uploads"}/${getDateFolder()}`;

            const paramsToSign = {
                timestamp,
                folder,
                ...(req.body.transformation && {
                    transformation: req.body.transformation,
                }),
            };

            const signature = cloudinary.utils.api_sign_request(
                paramsToSign,
                process.env.CLOUDINARY_API_SECRET,
            );

            res.json({
                success: true,
                data: {
                    timestamp,
                    signature,
                    apiKey: process.env.CLOUDINARY_API_KEY,
                    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                    folder,
                },
            });
        } catch (error) {
            console.error("Signature error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to generate signature",
                error: error.message,
            });
        }
    };

    static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        );
    }
}

export default CloudinaryController;
