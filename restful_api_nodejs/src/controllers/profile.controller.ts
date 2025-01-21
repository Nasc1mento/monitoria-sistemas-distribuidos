import { Request, Response } from 'express';
import { StatusCode } from '../constants/status-code';
import { hashPassword } from '../utils/hashing';
import { Collection, ObjectId } from 'mongodb';
import { toUserDTO, User } from '../models/user.model';
import { MongoConnection } from '../database/mongo.connection';
import { updateUserSchema } from '../schema/user.schema';


export class ProfileController {

    private collection: Collection<User>

    constructor() {
        this.collection = MongoConnection
        .getInstance()
        .getClient()
        .db("monitoria-api-restful")
        .collection("users");
    }

    async getProfile(req: Request, res: Response): Promise<Response> {
        const userId = req.user as string;

        const user = await this.collection.findOne({
                _id: new ObjectId(userId)
        });

        if (!user)
            return res.status(StatusCode.NOT_FOUND).send();

        return res.status(StatusCode.OK).json(toUserDTO(user));
    }

    async updateProfile(req: Request, res: Response): Promise<Response> {
        const userId = req.user as string;
        
        const {error, value: updatedUser} = updateUserSchema.validate(req.body);

        if (error) 
            return res.status(StatusCode.BAD_REQUEST).send(error.message);

        const existingUser = await this.collection.findOne({
            _id: new ObjectId(userId)
        });

        if (!existingUser)
            return res.status(StatusCode.NOT_FOUND).send();
        
        const password = updatedUser.password ? await hashPassword(updatedUser.password) : existingUser.password;

        await this.collection.updateOne({
            _id: new ObjectId(userId)
        },
        {
            $set: {
                ...updatedUser,
                password
            }
        });

        return res.status(StatusCode.NO_CONTENT).send();
    }

    async deleteProfile(req: Request, res: Response): Promise<Response> {
        const userId = req.user as string;
        const existingUser = await this.collection.findOne({
            _id: new ObjectId(userId)
        });

        if (!existingUser)
            return res.status(StatusCode.NOT_FOUND).send();

        await this.collection.deleteOne({
            _id: new ObjectId(userId)
        });

        return res.status(StatusCode.NO_CONTENT).send();
    }

}
