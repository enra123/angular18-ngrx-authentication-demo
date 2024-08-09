import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { SECRET } from "../config/index.js";
import jwt from "jsonwebtoken";

/**
 * @route POST auth/register
 * @desc Registers a user
 * @access Public
 */
export async function register(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { email, password } = req.body;
    try {
        // create an instance of a user
        const newUser = new User({
            email,
            password,
        });
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json("Email exists");

        await newUser.save(); // save new user into the database

        const token = await jwt.sign({ email: newUser.email }, SECRET, { expiresIn: '1h' });

        res.status(200).json(token);
    } catch (err) {
        res.status(500).json("Internal Server Error");
    }
    res.end();
}

/**
 * @route POST auth/login
 * @desc logs in a user
 * @access Public
 */
export async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user)
            return res.status(401).json("Invalid email or password");

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid)
            return res.status(401).json("Invalid email or password");
        // return user info except password
        // const { password, ...user profile } = user._doc;

        const token = await jwt.sign({ email: user.email }, SECRET, { expiresIn: '1h' });

        res.status(200).json(token);
    } catch (err) {
        res.status(500).json("Internal Server Error");
    }
    res.end();
}

/**
 * @route GET auth/user
 * @desc provide logged-in user data
 * @access Public
 */
export async function getUserProfile(req, res) {
    try {
        const user = await User.findOne({email: req.userEmail});
        if (!user) {
            return res.status(404).json('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json('Internal server error');
    }
    res.end();
}
