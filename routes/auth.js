import express from "express";
import { getUserProfile, login, register } from "../controllers/auth.js";
import { verifyToken } from "../middleware/verify.js";
import { check } from "express-validator";
import validate from "../middleware/validate.js";

const authRouter = express.Router();

// Register route -- POST request
authRouter.post(
    "/register",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    validate,
    register
);

// Login route == POST request
authRouter.post("/login",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("password").not().isEmpty(),
    validate,
    login
);

authRouter.get('/user', verifyToken, getUserProfile);

export default authRouter;