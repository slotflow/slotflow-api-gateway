import { log } from "../shared/logger/logger";
export class CacheServiceImpl {
    redisClient;
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    ;
    async getBlockList(key) {
        try {
            const updatedKey = `user:block-status:${key}`;
            return await this.redisClient.get(updatedKey);
        }
        catch (error) {
            log.error("getBlockList failed", error);
            throw error;
        }
        ;
    }
    ;
}
;
