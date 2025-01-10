import 'dotenv/config';

export const env = Object.freeze({
    MONGO_URI: String(process.env.MONGO_URI),
    PORT: Number(process.env.PORT),
});