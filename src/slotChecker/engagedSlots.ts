import { log } from "../shared/logger/logger";
import { redisClient } from "../cache/redis/redis";
import { ERROR_CODES } from "../shared/utils/types";
import { AppError } from "../shared/error/appError";
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
            success: true,
            message: "Engaged slots fetched successfully",
            data: engagedSlotIds
        });

    } catch (error) {
        log.error("Error in engagedSlots middleware", error as Error);
        next(new AppError(
            "Internal server error",
            500,
            false,
            ERROR_CODES.INTERNAL_ERROR
        ))
    }
}