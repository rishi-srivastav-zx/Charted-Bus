import User from "../models/user.js";
import { verifyAccessToken } from "../utils/jwt.js";

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token",
            });
        }

        try {
            const decoded = verifyAccessToken(token);

            const user = await User.findOne({ _id: decoded.userId, isDeleted: false }).select(
                "+passwordChangedAt",
                
            );

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found",
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: "Account has been deactivated",
                });
            }

            if (user.changedPasswordAfter(decoded.iat)) {
                return res.status(401).json({
                    success: false,
                    message: "Password recently changed, please log in again",
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed",
            });
        }
    } catch (error) {
        next(error);
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role) && req.user.role !== "superadmin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to access this resource",
            });
        }
        next();
    };
};

const requirePermission = (...permissions) => {
    return (req, res, next) => {
        const userPermissions = req.user.permissions || [];
        const hasPermission = permissions.every(
            (p) =>
                userPermissions.includes(p) || req.user.role === "superadmin",
        );

        if (!hasPermission && req.user.role !== "superadmin") {
            return res.status(403).json({
                success: false,
                message: "Insufficient permissions",
            });
        }
        next();
    };
};

const superAdminOnly = (req, res, next) => {
    if (req.user.role !== "superadmin") {
        return res.status(403).json({
            success: false,
            message: "Super Admin access required",
        });
    }
    next();
};

export { protect, restrictTo, requirePermission, superAdminOnly };
