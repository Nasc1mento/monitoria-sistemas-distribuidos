import { Decimal128, ObjectId } from "mongodb";

// https://www.mongodb.com/docs/drivers/node/v4.8/fundamentals/typescript/
export interface Product {
    _id?: ObjectId;
    name: string;
    price: Decimal128; // https://www.mongodb.com/docs/mongodb-shell/reference/data-types/#decimal128
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

