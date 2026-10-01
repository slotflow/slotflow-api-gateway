import { redisClient } from "../cache/redis/redis";
import { CacheServiceImpl } from "./cache.service.impl";
import { ICacheService } from "../interfaces/service/ICache.service";

// cache service instance
export const cacheService: ICacheService = new CacheServiceImpl(redisClient);