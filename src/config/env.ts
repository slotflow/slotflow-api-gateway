import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV ?? 'development',

    frontendUrl: process.env.FRONTEND_URL!,
    jwtSecret: process.env.JWT_SECRET!,

    services: {
        mainBackend: process.env.MAIN_BACKEND_SERVICE_URL!,
        notification: process.env.NOTIFICATION_SERVICE_URL!,
        realtime: process.env.REALTIME_SERVICE_URL!,
    }
};