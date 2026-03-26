import { redisClient } from "../lib/redis";
import { log } from "../shared/logger/logger";
import { Request, Response, NextFunction } from "express";

export const engagedSlots = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { providerId, date } = req.params;

        const pattern = `engaged:slots:slot:${providerId}:${date}:*`;

        const keys = await redisClient.keys(pattern);

        const engagedSlotIds = keys.map(key => {
            const parts = key.split(":");
            return parts[parts.length - 1];
        });


        res.status(200).json({
            status: "success",
            data: engagedSlotIds
        });
    } catch (error) {
        log.error("Error in engagedSlots middleware", error as Error);
        return res.status(500).json({ message: "Internal server error" });
    }
}