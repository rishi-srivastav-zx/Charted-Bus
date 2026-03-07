import User from "../models/user.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.js";

// Cookie options
const accessTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @desc    Register new user (Super Admin creation)
// @route   POST /api/auth/register-superadmin
// @access  Public (with setup key for security)
export const registerSuperAdmin = async (req, res) => {
    try {
        const { email, password, firstName, setupKey } = req.body;

        // Verify setup key (prevents unauthorized super admin creation)
        if (setupKey !== process.env.SUPERADMIN_SETUP_KEY) {
            return res.status(403).json({
                success: false,
                message: "Invalid setup key",
            });
        }

        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ role: "superadmin" });
        if (existingSuperAdmin) {
            return res.status(400).json({
                success: false,
                message: "Super Admin already exists",
            });
        }

        // Create super admin with all permissions
        const superAdmin = await User.create({
            email,
            password,
            firstName,
            role: "superadmin",
            permissions: [
                "users:manage",
                "users:view",
                "buses:manage",
                "buses:view",
                "routes:manage",
                "routes:view",
                "bookings:manage",
                "bookings:view",
                "payments:manage",
                "payments:view",
                "reports:view",
                "reports:manage",
                "settings:manage",
                "system:admin",
            ],
            emailVerified: true,
        });

        // Generate tokens
        const accessToken = generateAccessToken(superAdmin._id);
        const refreshToken = generateRefreshToken(superAdmin._id);

        // Save refresh token to database
        superAdmin.refreshTokens.push({
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await superAdmin.save();

        // Set cookies
        res.cookie("accessToken", accessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

        res.status(201).json({
            success: true,
            message: "Super Admin created successfully",
            data: {
                user: {
                    id: superAdmin._id,
                    email: superAdmin.email,
                    firstName: superAdmin.firstName,
                    role: superAdmin.role,
                    permissions: superAdmin.permissions,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        // Get user with password
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check if account is locked
        if (user.isLocked()) {
            return res.status(423).json({
                success: false,
                message:
                    "Account is locked due to too many failed attempts. Try again in 2 hours.",
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            await user.incrementLoginAttempts();
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Reset login attempts on successful login
        if (user.loginAttempts > 0) {
            await User.updateOne(
                { _id: user._id },
                { $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } },
            );
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshTokens.push({
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        // Limit stored refresh tokens (keep last 5)
        if (user.refreshTokens.length > 5) {
            user.refreshTokens = user.refreshTokens.slice(-5);
        }

        await user.save();

        // Set cookies
        res.cookie("accessToken", accessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    role: user.role,
                    permissions: user.permissions,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (with valid refresh token)
export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found",
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user with this refresh token
        const user = await User.findOne({
            _id: decoded.userId,
            "refreshTokens.token": refreshToken,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        // Remove old refresh token
        user.refreshTokens = user.refreshTokens.filter(
            (t) => t.token !== refreshToken,
        );

        // Generate new tokens
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Save new refresh token
        user.refreshTokens.push({
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await user.save();

        // Set new cookies
        res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

        res.json({
            success: true,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid refresh token",
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (req.user && refreshToken) {
            // Remove refresh token from database
            await User.updateOne(
                { _id: req.user._id },
                { $pull: { refreshTokens: { token: refreshToken } } },
            );
        }

        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
export const logoutAll = async (req, res) => {
    try {
        // Remove all refresh tokens
        await User.updateOne(
            { _id: req.user._id },
            { $set: { refreshTokens: [] } },
        );

        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.json({
            success: true,
            message: "Logged out from all devices",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    role: user.role,
                    permissions: user.permissions,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select("+password");

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Generate new tokens (optional - forces re-login on other devices)
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Clear old refresh tokens and set new one
        user.refreshTokens = [
            {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        ];
        await user.save();

        res.cookie("accessToken", accessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

        res.json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
