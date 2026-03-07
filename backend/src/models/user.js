import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false, // Don't include in queries by default
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
    },
    role: {
        type: String,
        enum: ["superadmin", "admin", "operator", "driver", "customer"],
        default: "customer",
    },
    permissions: [
        {
            type: String,
            enum: [
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
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: Date,
    refreshTokens: [
        {
            token: String,
            createdAt: { type: Date, default: Date.now },
            expiresAt: Date,
        },
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes for performance
userSchema.index({ role: 1 });
userSchema.index({ refreshTokens: 1 });

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
    this.updatedAt = Date.now();
});

// Update passwordChangedAt when password changes
userSchema.pre("save", async function () {
    if (!this.isModified("password") || this.isNew) return;
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token is created after
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Check if account is locked
userSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function () {
    // Reset if lock has expired
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 },
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };

    // Lock account after 5 failed attempts
    if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
    }

    return this.updateOne(updates);
};

export default mongoose.model("User", userSchema);
