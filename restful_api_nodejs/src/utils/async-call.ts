import { Request, Response } from 'express';
import { StatusCode } from '../constants/status-code';

export default async function asyncCall (req: Request, res: Response, fn: Function)  {
    try {
        await fn(req, res);
    } catch(error: any) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
}
