export class Validator {
    requireEnv(key) {
        const value = process.env[key];
        if (!value) {
            throw new Error(`${key} is not defined`);
        }
        ;
        return value;
    }
    ;
    requireNumber(key) {
        const value = Number(process.env[key]);
        if (!Number.isFinite(value)) {
            throw new Error(`${key} must be a valid number`);
        }
        ;
        return value;
    }
    ;
}
;
