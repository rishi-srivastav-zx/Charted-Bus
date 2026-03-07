import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};

const registerValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        )
        .withMessage(
            "Password must contain at least one uppercase, one lowercase, one number and one special character",
        ),
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    handleValidationErrors,
];

const loginValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    handleValidationErrors,
];

const validateBus = [
    body("name").trim().notEmpty().withMessage("Bus name is required"),
    body("type").trim().notEmpty().withMessage("Bus type is required"),
    body("capacity").isNumeric().withMessage("Capacity must be a number"),
    body("pricePerHour").isNumeric().withMessage("Price per hour must be a number"),
    handleValidationErrors,
];

const validateQuery = [
    handleValidationErrors,
];

export { registerValidation, loginValidation, handleValidationErrors, validateBus, validateQuery };
