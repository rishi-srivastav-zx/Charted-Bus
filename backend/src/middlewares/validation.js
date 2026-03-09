import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation Body:", JSON.stringify(req.body, null, 2));
        console.log(
            "Validation Errors:",
            JSON.stringify(errors.array(), null, 2),
        );
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
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("seatCapacity")
        .isNumeric()
        .withMessage("Seat capacity must be a number"),
    body("pricing.price").isNumeric().withMessage("Price must be a number"),
    handleValidationErrors,
];

const validateQuery = [handleValidationErrors];

export {
    registerValidation,
    loginValidation,
    handleValidationErrors,
    validateBus,
    validateQuery,
};
