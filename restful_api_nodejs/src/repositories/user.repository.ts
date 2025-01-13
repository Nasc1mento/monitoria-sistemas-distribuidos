import { Collection, ObjectId } from "mongodb";
import { User } from "../models/user.model";
import { MongoConnection } from "../database/mongo.connection";


export class UserRepository {

    private collection: Collection<User>

    constructor() {
        this.collection = MongoConnection
        .getInstance()
        .getClient()
        .db("monitoria-api-restful")
        .collection("users");
    }


    async get(id: string): Promise<User | null> {
        return await this.collection.findOne(
            {
                _id: new ObjectId(id),
            },
        );
    }


    async update(id: string, user: User): Promise<void> {
        await this.collection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    ...user,
                }
            }
        );
    }

    async delete(id: string): Promise<void> {
        await this.collection.deleteOne(
            {
                _id: new ObjectId(id),
            }
        );
    }
}