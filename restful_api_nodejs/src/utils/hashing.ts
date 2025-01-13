import bcrypt from 'bcrypt';
import { env } from '../config/env';

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, bcrypt.genSaltSync(env.SALT_ROUNDS));
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}