import { cacheService } from "../services";
import { log } from "../shared/logger/logger";
import { NextFunction, Request, Response } from "express";

export const blockCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user information found" });
        }

        console.log("userId : ",userId);
        const cachedStatus = await cacheService.getBlockList(userId);
        console.log("cachedStatus : ",cachedStatus);

        if (cachedStatus !== null) {
            if (cachedStatus === "true") {
                return res
                    .status(403)
                    .json({ success: false, message: "Your account is blocked" });
            }
            return next();
        }

        next();
    } catch (error) {
        log.error("Error in blockCheckMiddleware", error as Error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};