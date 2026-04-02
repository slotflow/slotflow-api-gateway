import dotenv from 'dotenv';
dotenv.config();

import { Validator } from '../shared/validator/validator';

const validator = new Validator

export const appConfig = {
    port: validator.requireNumber("PORT"),
    nodeEnv: validator.requireEnv("NODE_ENV"),
    isDev: validator.requireEnv("NODE_ENV") === "development",
    serviceName: validator.requireEnv("SERVICE_NAME"),
};

export const jwtConfig = {
    jwtSecret: validator.requireEnv("JWT_SECRET"),
};

export const redisConfig = {
    redisUrl: validator.requireEnv("REDIS_URL"),
    redisToken: validator.requireEnv("REDIS_TOKEN"),
    redisBlockListTtl: validator.requireNumber("REDIS_TTL_SECONDS_BLOCKLIST"),
    redisOtpTtl: validator.requireNumber("REDIS_TTL_SECONDS_OTP"),
};

export const serviceConfig = {
    frontendUrl: appConfig.isDev ? validator.requireEnv("FRONTEND_URL_DEV") : validator.requireEnv("FRONTEND_URL"),
    apiGatewayUrl: appConfig.isDev ? validator.requireEnv("API_GATEWAY_URL_DEV") : validator.requireEnv("API_GATEWAY_URL"),
    mainBackendServiceUrl: appConfig.isDev ? validator.requireEnv("MAIN_BACKEND_SERVICE_URL_DEV") : validator.requireEnv("MAIN_BACKEND_SERVICE_URL"),
    realtimeServiceUrl: appConfig.isDev ? validator.requireEnv("REALTIME_SERVICE_URL_DEV") : validator.requireEnv("REALTIME_SERVICE_URL"),
    notificationServiceUrl: appConfig.isDev ? validator.requireEnv("NOTIFICATION_SERVICE_URL_DEV") : validator.requireEnv("NOTIFICATION_SERVICE_URL"),
    paymentServiceUrl: appConfig.isDev ? validator.requireEnv("PAYMENT_SERVICE_URL_DEV") : validator.requireEnv("PAYMENT_SERVICE_URL"),
};

export const otelConfig = {
    otelExporterOtlpEndpoint: appConfig.isDev ? validator.requireEnv("OTEL_EXPORTER_OTLP_ENDPOINT_DEV") : validator.requireEnv("OTEL_EXPORTER_OTLP_ENDPOINT"),
};