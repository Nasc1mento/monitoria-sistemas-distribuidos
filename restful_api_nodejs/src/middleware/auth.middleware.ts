import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env'; '../config/env';
import { StatusCode }from '../constants/status-code';


export async function authMiddleware (req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(StatusCode.UNAUTHORIZED).send('Token not provided');
        return;
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as string;
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(StatusCode.FORBIDDEN).send('Invalid Token');
        } else if (error instanceof jwt.TokenExpiredError) {
            res.status(StatusCode.FORBIDDEN).send('Token Expired');
        }

        res.status(StatusCode.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
}