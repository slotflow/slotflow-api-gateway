export interface ICacheService {

    getBlockList(key: string): Promise<string | null>;
    
};