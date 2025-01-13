import { Decimal128, ObjectId } from "mongodb";

// https://www.mongodb.com/docs/drivers/node/v4.8/fundamentals/typescript/
export interface Product {
    _id: ObjectId;
    userId: ObjectId;
    name: string;
    price: Decimal128;
    createdAt: Date;
    updatedAt: Date;
}


export interface ProductResponse {
    _id: ObjectId;
    name: string;
    price: Decimal128;
    createdAt: Date;
    updatedAt: Date;
}

export function toProductResponse(product: Product): ProductResponse {
    return {
        _id: product._id,
        name: product.name,
        price: product.price,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    }
}

