import { redisClient } from "../lib/redis";
import { CacheServiceImpl } from "./cache.service.impl";
// cache service instance
export const cacheService = new CacheServiceImpl(redisClient);
