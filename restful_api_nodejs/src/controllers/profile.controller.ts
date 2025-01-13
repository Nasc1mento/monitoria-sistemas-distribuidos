import { Request, Response } from "express";
import { toUserResponse, User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import {StatusCode} from "../constants/status-code";


export class ProfileController {

    private repository: UserRepository

    constructor() {
        this.repository = new UserRepository();
    }

    async getProfile(req: Request, res: Response): Promise<Response> {
        const user = req.user as User;
        console.log("cheguei aqui")
        if (!user) {
            return res.status(StatusCode.UNAUTHORIZED).send();
        }

        return res.status(StatusCode.OK).json(toUserResponse(user));
    }

    async updateProfile(req: Request, res: Response): Promise<Response> {
        const {_id: userId} = req.user as User;
        const user: User = req.body;

        await this.repository.update(String(userId), {
            ...user,
            updatedAt: new Date()
        });
        return res.status(StatusCode.NO_CONTENT).send();
    }

    async deleteProfile(req: Request, res: Response): Promise<Response> {
        const {_id: userId} = req.user as User;
        await this.repository.delete(String(userId));
        return res.status(StatusCode.NO_CONTENT).send();
    }

}
