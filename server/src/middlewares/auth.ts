import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser"

const secretKey = "your_jwt_secret";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
};
