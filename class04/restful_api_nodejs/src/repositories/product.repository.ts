import { Collection, Decimal128, ObjectId } from "mongodb";
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
    
    async insertOne(product: Product): Promise<Product> {
        const r = await this.collection.insertOne(
            {
                ...product,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

        return { ...product, _id: r.insertedId };
    }

    async findAll(): Promise<Product[]> {
        return await this.collection.find().toArray();
    }

    async findOne(id: string): Promise<Product | null> {
        return await this.collection.findOne(
            {
                _id: new ObjectId(id)
            }
        );
    }

    async removeOne(id: string): Promise<void> {
        await this.collection.deleteOne(
            {
                _id: new ObjectId(id)
            }
        );
    }

    async updateOne(id: string, product: Product): Promise<void> {
        await this.collection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    ...product,
                    updatedAt: new Date()
                }
            }
        )
    }
}