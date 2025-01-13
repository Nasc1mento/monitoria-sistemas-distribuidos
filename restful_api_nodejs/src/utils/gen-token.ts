import { env } from "../config/env";
import jwt from 'jsonwebtoken';

export function generateJwtToken(payload: any) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES });
}