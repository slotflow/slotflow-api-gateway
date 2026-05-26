import { cacheService } from "../services";
import { log } from "../shared/logger/logger";
import { ERROR_CODES, Role } from "../shared/utils/types";
import { NextFunction, Request, Response } from "express";
import { AppError, ForbiddenError, UnauthorizedError } from "../shared/error/appError";

export const blockCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("user block checking")
        const userId = req.user?.id;
        const role = req.user?.role;

        if (role !== Role.ADMIN && !userId) {
            return next(new UnauthorizedError());
        }

        const cachedStatus = await cacheService.getBlockList(userId as string);

        if (cachedStatus !== null) {
            if (cachedStatus === "true") {
                return next(new ForbiddenError(
                    "Your account is blocked from api gateway",
                    ERROR_CODES.ACCOUNT_BLOCKED
                ));
            }
            return next();
        }

        next();
    } catch (error) {
        log.error("Error in blockCheckMiddleware", error as Error);
        next(new AppError(
            "Internal server error",
            500,
            false,
            ERROR_CODES.INTERNAL_ERROR
        ))
    }
};