import { toUserResponse, User } from "../models/user.model";
import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/hashing";
import {StatusCode} from "../constants/status-code";
import {AuthRepository} from "../repositories/auth.repository";
import { generateJwtToken } from "../utils/gen-token";


export class AuthController {

    private repository: AuthRepository;

    constructor() {
        this.repository = new AuthRepository();
    }

    async login(req: Request, res: Response): Promise<Response> {
        const user: User = req.body;
        const userExists: User | null = await this.repository.findByEmail(user.email);
        
        if (!userExists) {
            return res.status(StatusCode.UNAUTHORIZED).send('User not found');
        }

        if (!await comparePassword(user.password, userExists.password)) {
            return res.status(StatusCode.UNAUTHORIZED).send('Invalid password');
        }

        const token = generateJwtToken(userExists);
        return res.status(StatusCode.OK).json({token});
    }

    async register(req: Request, res: Response): Promise<Response> {
        const user: User = req.body;
        
        if (await this.repository.findByEmail(user.email)) {
            return res.status(StatusCode.CONFLICT).send('User already exists');
        }

        const hashedPassword = await hashPassword(user.password);
        const savedUser: User = await this.repository.register({
            ...user,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.status(StatusCode.CREATED).json(toUserResponse(savedUser));
    }
}