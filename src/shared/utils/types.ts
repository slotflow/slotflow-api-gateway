import { JwtPayload } from "jsonwebtoken";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    PROVIDER = "PROVIDER",
};

export interface User {
    id: string;
    role: Role;
};

export enum ERROR_CODES {
    // COMMON
    INTERNAL_ERROR = "INTERNAL_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_REQUEST = "INVALID_REQUEST",
    FORBIDDEN = "FORBIDDEN",
    CREDENTIAL_NOT_FOUND = "CREDENTIAL_NOT_FOUND",
    INVALID_TOKEN = "INVALID_TOKEN",
    UNABLE_TO_UPDATE_ROLE = "UNABLE_TO_UPDATE_ROLE",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    ACCOUNT_BLOCKED = "ACCOUNT_BLOCKED",

    // AUTH
    UNAUTHORIZED = "UNAUTHORIZED",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    TOKEN_INVALID = "TOKEN_INVALID",

    // USER
    USER_NOT_FOUND = "USER_NOT_FOUND",
};

// TimeZone interface
export interface TimeZone {
    value: string;
    label: string;
    offset: number;
    abbrev: string;
    altName: string;
}

export interface AuthUser {
    id: string;
    role: Role;
    name: string;
    email: string;
    timeZone: TimeZone;
}

export interface AccessTokenPayload extends JwtPayload, Omit<AuthUser, 'id'> {
    userId: string;
};