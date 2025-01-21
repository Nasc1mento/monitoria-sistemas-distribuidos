import { Request, Response } from "express";
import { StatusCode } from "../constants/status-code";
import { generateJwtToken } from "../utils/gen-token";
import { comparePassword, hashPassword } from "../utils/hashing";
import { Collection, ObjectId } from "mongodb";
import { MongoConnection } from "../database/mongo.connection";
import { LoginDTO, toUserDTO, User } from "../models/user.model";
import { createUserSchema } from "../schema/auth.schema";


export class AuthController {

    private collection: Collection<User>

    constructor() {
        this.collection = MongoConnection
        .getInstance()
        .getClient()
        .db("monitoria-api-restful")
        .collection("users");
    }

    async login(req: Request, res: Response): Promise<Response> {
        
        const user = req.body as LoginDTO;
        const existingUser: User | null = await this.collection.findOne({email: user.email});

        if (!existingUser)
            return res.status(StatusCode.UNAUTHORIZED).send('User not found');


        if (!await comparePassword(user.password, existingUser.password))
            return res.status(StatusCode.UNAUTHORIZED).send('Invalid password');

        const token = generateJwtToken({id: existingUser._id});

        return res.status(StatusCode.OK).json({
            token,
            user: toUserDTO(existingUser)
        });
    }

    async register(req: Request, res: Response): Promise<Response> {
        const {error, value: newUser} = createUserSchema.validate(req.body);
        if (error)
            return res.status(StatusCode.BAD_REQUEST).send(error.message);

        if (await this.collection.findOne({email: newUser.email}))
            return res.status(StatusCode.CONFLICT).send('User already exists');

        const hashedPassword = await hashPassword(newUser.password);

        const savedUser: User = {
            ...newUser,
            password: hashedPassword,
            _id: new ObjectId()
        }

        await this.collection.insertOne(savedUser);

        return res.status(StatusCode.CREATED).json(toUserDTO(savedUser));
    }
}