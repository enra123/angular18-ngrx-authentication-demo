import jwt from "jsonwebtoken";
import { SECRET } from '../config/index.js';

export async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1]

        if (!token) return res.sendStatus(401);

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json("This session has expired. Please login");
            }

            req.userEmail = decoded.email;
            next();
        });
    } catch (err) {
        res.status(500).json("Internal Server Error");
    }
}