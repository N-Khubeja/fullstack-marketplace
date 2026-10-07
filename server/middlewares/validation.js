const { body, validationResult } = require("express-validator")

const PRODUCT_CATEGORIES = require("../constants/Categories")
PRODUCT_ATTRIBUTE_RULES = require("../constants/productAttributeRules")

const LoginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
]

const RegisterValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .matches(/^[a-zA-Zა-ჰ\s'-]+$/)
        .withMessage("Only letters allowed"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 100 })
        .withMessage("Password must be between 8 and 100 characters")
        .matches(/[A-Z]/)
        .withMessage("Must contain uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Must contain lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Must contain number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Must contain special character")
]

const PasswordChangeValidation = [
    body("oldpassword")
      .notEmpty()
      .withMessage("oldPassword is required"),

    body("newpassword")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 100 })
        .withMessage("Password must be between 8 and 100 characters")
        .matches(/[A-Z]/)
        .withMessage("Must contain uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Must contain lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Must contain number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Must contain special character"),

    body("confirmNewPassword")
      .notEmpty()
      .withMessage("Please confirm password")


]


const ProfileUpdateValidation = [
  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid email"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Zა-ჰ\s'-]+$/)
    .withMessage("Only letters allowed")
]

const ForgetPasswordValidation = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid email"),
]

const ResetPassword = [
    body("token")
    .trim()
    .notEmpty()
    .withMessage("Reset token is required"),


    body("newPassword")
    .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 100 })
        .withMessage("Password must be between 8 and 100 characters")
        .matches(/[A-Z]/)
        .withMessage("Must contain uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Must contain lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Must contain number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Must contain special character"),
    
    body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
        }

        return true;
    }),

]

const UploadProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("description is required")
    .isLength({ max: 2000 })
    .withMessage("Description must be less than 2000 characters"),

  body("price")
    .notEmpty()
    .withMessage("price is required")
    .isFloat({ min: 0 })
    .withMessage("price must be a number greater than or equal to 0"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("category is required")
    .bail()
    .custom((value) => {
      if (!PRODUCT_CATEGORIES[value]) {
        throw new Error("Invalid category")
      }

      return true
    }),

  body("subcategory")
    .trim()
    .notEmpty()
    .withMessage("subcategory is required")
    .bail()
    .custom((value, { req }) => {
      const category = req.body.category

      if (!PRODUCT_CATEGORIES[category]) {
        throw new Error("Invalid category")
      }

      if (!PRODUCT_CATEGORIES[category].includes(value)) {
        throw new Error("Invalid subcategory")
      }

      return true
    }),

  body("stock")
    .notEmpty()
    .withMessage("stock is required")
    .isInt({ min: 0 })
    .withMessage("stock must be a non-negative integer"),

  body("visibility")
    .optional()
    .isIn(["public", "private"])
    .withMessage("visibility must be either public or private"),

    body("attributes")
  .custom((attributes, { req }) => {
    const subcategory = req.body.subcategory

    const rules = PRODUCT_ATTRIBUTE_RULES[subcategory]

    if (!rules) {
      throw new Error(
        "No attribute rules found for this subcategory"
      )
    }

    if (
      !attributes ||
      typeof attributes !== "object" ||
      Array.isArray(attributes)
    ) {
      throw new Error("Attributes must be an object")
    }

    for (const [key, rule] of Object.entries(rules)) {
      const value = attributes[key]

      if (
        rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        throw new Error(`${key} is required`)
      }

      if (
        value !== undefined &&
        value !== null &&
        typeof value !== rule.type
      ) {
        throw new Error(
          `${key} must be of type ${rule.type}`
        )
      }
    }

    return true
  })
]

const UpdateProductVal = [
  body("name")
    .trim()
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("description")
    .trim()
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description must be less than 2000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("price must be a number greater than or equal to 0"),

  body("category")
    .trim()
    .optional()
    .custom((value) => {
      if (!PRODUCT_CATEGORIES[value]) {
        throw new Error("Invalid category")
      }

      return true
    }),

  body("subcategory")
    .optional()
    .isString()
    .withMessage("subcategory must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("subcategory cannot be empty"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("stock must be a non-negative integer"),

  body("attributes")
    .optional()
    .custom((value) => {
      if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
      ) {
        throw new Error("attributes must be an object")
      }

      return true
    }),

  body("visibility")
    .optional()
    .isIn(["public", "private"])
    .withMessage("visibility must be either public or private"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
]

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const formattedErrors = {}

        errors.array().forEach((error) => {
            if (!formattedErrors[error.path]) {
                formattedErrors[error.path] = []
            }

            formattedErrors[error.path].push(error.msg)
        })

        return res.status(400).json({
            errors: formattedErrors
        })
    }

    next()
}

module.exports = { LoginValidation, RegisterValidation, PasswordChangeValidation, ProfileUpdateValidation, ForgetPasswordValidation, ResetPassword ,UploadProduct, UpdateProductVal, handleValidationErrors }