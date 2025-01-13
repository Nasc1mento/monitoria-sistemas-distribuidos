import { Collection, InsertOneResult, ObjectId } from "mongodb";
import { User } from "../models/user.model";
import { MongoConnection } from "../database/mongo.connection";


export class AuthRepository {

    private collection: Collection<User>

    constructor() {
        this.collection = MongoConnection
        .getInstance()
        .getClient()
        .db("monitoria-api-restful")
        .collection("users");
    }


    async findByEmail(email: string): Promise<User | null> {
        return await this.collection.findOne(
            {
                email,
            },
        );
    }

    async register(user: User): Promise<User> {
        const result: InsertOneResult<User> = await this.collection.insertOne(user);
        return {
            ...user,
            _id: result.insertedId
        }
    }
}