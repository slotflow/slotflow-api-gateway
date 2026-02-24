import { jwtConfig } from "../config/env";
import { log } from "../shared/logger/logger";
import jwt from "jsonwebtoken";
;
export const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    ;
    try {
        const decoded = jwt.verify(token, jwtConfig.jwtSecret);
        if (typeof decoded === "string") {
            return res.status(401).json({ message: "Invalid token" });
        }
        ;
        const payload = decoded;
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            return res.status(401).json({ message: "Token expired" });
        }
        ;
        req.user = {
            id: payload.userOrProviderId,
            role: payload.role,
        };
        next();
    }
    catch (error) {
        log.error("Error in authMiddleware", error);
        return res.status(401).json({ message: "Invalid token" });
    }
    ;
};
