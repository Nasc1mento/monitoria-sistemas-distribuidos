import 'dotenv/config';

export const env = Object.freeze({
    MONGO_URI: String(process.env.MONGO_URI),
    PORT: Number(process.env.PORT),
    JWT_SECRET: String(process.env.JWT_SECRET),
    JWT_EXPIRES: String(process.env.JWT_EXPIRES),
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS),
});