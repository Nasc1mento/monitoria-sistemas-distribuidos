import { Decimal128, Double, ObjectId } from 'mongodb';

// https://www.mongodb.com/docs/drivers/node/v4.8/fundamentals/typescript/
export interface Product {
    _id: ObjectId;
    userId: ObjectId;
    name: string;
    price: Decimal128;
}

export type ProductDTO = Omit<Product, 'userId'>;
export type CreateProductDTO = Omit<Product, '_id' | 'userId'>;
export type UpdateProductDTO = Partial<CreateProductDTO>;

export function toProductDTO(product: Product): ProductDTO {
    return {
        _id: product._id,
        name: product.name,
        price: product.price,
    }
}
