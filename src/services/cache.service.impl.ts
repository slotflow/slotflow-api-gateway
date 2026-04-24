import { Redis } from "@upstash/redis";
import { log } from "../shared/logger/logger";
import { ERROR_CODES } from "../shared/utils/types";
import { ICacheService } from "../interfaces/ICache.service";
import { AppError, BadRequestError } from "../shared/error/appError";

export class CacheServiceImpl implements ICacheService {

    constructor(
        private redisClient: Redis
    ) { };

    async getBlockList(key: string): Promise<string | null> {
        try {
            if (!key) {
                throw new BadRequestError();
            }
            const updatedKey: string = `user:block-status:${key}`;
            return await this.redisClient.get(updatedKey);
        } catch (error) {
            log.error("getBlockList failed", error as Error);
            throw new AppError(
                "Internal server error",
                500,
                false,
                ERROR_CODES.INTERNAL_ERROR
            );
        };
    };

};