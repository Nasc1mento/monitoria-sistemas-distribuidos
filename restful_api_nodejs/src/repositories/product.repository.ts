import { Collection, ObjectId } from "mongodb";
import { Product } from "../models/product.model";
import { MongoConnection } from "../database/mongo.connection";


export class ProductRepository {
    
    private collection: Collection<Product>

    constructor() {
        this.collection = MongoConnection
        .getInstance()
        .getClient()
        .db("monitoria-api-restful")
        .collection("produtos");
    }
    
    async insertOne(userId: string, product: Product): Promise<Product> {
        const result = await this.collection.insertOne({
            ...product,
            userId: new ObjectId(userId),
        });

        return {
            ...product,
            _id: result.insertedId
        }
    }

    // https://medium.com/swlh/mongodb-pagination-fast-consistent-ece2a97070f3
    async findAll(userId: string, lastId: string, limit: number = 20, sort: Record<string, 1 | -1> = {_id:-1}): Promise<Product[]> {
        return await this.collection
        .find(ObjectId.isValid(lastId) ? {
            _id: {
                    $gt: new ObjectId(lastId)
                }
            } : {})
        .limit(limit)
        .sort(sort)
        .filter({userId: new ObjectId(userId)})
        .project({userId: 0})
        .toArray() as Product[];
    }

    async findOne(userId: string, id: string): Promise<Product | null> {
        return await this.collection.findOne(
            {
                _id: new ObjectId(id),
                userId: new ObjectId(userId)         
            }
        );
    }

    async removeOne(userId: string, id: string): Promise<void> {
        await this.collection.deleteOne(
            {
                _id: new ObjectId(id),
                userId: new ObjectId(userId)
            }
        );
    }

    async updateOne(userId: string, id: string, product: Product): Promise<void> {
        await this.collection.updateOne(
            {
                _id: new ObjectId(id),
                userId: new ObjectId(userId)
            },
            {
                $set: {
                    ...product,
                }
            }
        )
    }
}
