import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: { id: string; email: string; role: string };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: "Token missing or invalid" });
        return;
    }


    const jwtSecret = process.env.JWT_SECRET || 'default_secret';

    try {
        const decodedToken = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
        req.user = { id: decodedToken.id, email: decodedToken.email, role: decodedToken.role };
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
    }
};

export default authenticateToken;
