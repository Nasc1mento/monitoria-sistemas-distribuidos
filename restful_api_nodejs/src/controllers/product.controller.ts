import { Request, Response } from 'express';
import { StatusCode } from '../constants/status-code';
import { Collection, ObjectId } from 'mongodb';
import { MongoConnection } from '../database/mongo.connection';
import { Product, toProductDTO } from '../models/product.model';
import { createProductSchema, updateProductSchema } from '../schema/product.schema';


export class ProductController {

    private collection: Collection<Product>

    constructor() {
        this.collection = MongoConnection
        .getInstance()
        .getClient()
        .db("monitoria-api-restful")
        .collection("products");
    }

    async insertOne(req: Request, res: Response): Promise<Response> {
        const userId = req.user as string;
        const {error, value: product} = createProductSchema.validate(req.body);
        if (error)
            return res.status(StatusCode.BAD_REQUEST).send(error.message);

        const newProduct: Product = {
            ...product,
            userId: new ObjectId(userId),
            _id: new ObjectId()
        }
        
        await this.collection.insertOne(newProduct);

        return res.status(StatusCode.CREATED).json(toProductDTO(newProduct));
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        const userId = req.user as string;
        const lastId = String(req.query.lastId)
        const limit = Number(req.query.limit);
        const sort = String(req.query.sort);
        const dir = String(req.query.dir) === '1' ? 1 : -1;
        const products: Product[] = await this.collection.find(
        ObjectId.isValid(lastId) ? {
            _id: {
                $gt: new ObjectId(lastId)
            }
        } : {})
        .limit(limit)
        .sort({
            [sort]: dir
        })
        .filter({
            userId: new ObjectId(userId)
        })
        .toArray();

        return res.status(StatusCode.OK).json(products.map(product => toProductDTO(product)));
    }

    async getOne(req: Request, res: Response): Promise<Response> {
        const userId = req.user as string;
        const id = String(req.params.id);
        const product: Product | null = await this.collection.findOne({
            _id: new ObjectId(id),
            userId: new ObjectId(userId)
        });

        if (!product)
            return res.status(StatusCode.NOT_FOUND).send();

        return res.status(StatusCode.OK).json(toProductDTO(product));
    }

    async updateOne(req: Request, res: Response): Promise<Response> {
        const userId = req.user as string;
        const id = req.params.id;
        const {error, value: updatedProduct} = updateProductSchema.validate(req.body);
        const existingProduct = await this.collection.findOne({
            _id: new ObjectId(id),
            userId: new ObjectId(userId)
        });

        if (!existingProduct) return res.status(StatusCode.NOT_FOUND).send();

        if (error)
            return res.status(StatusCode.BAD_REQUEST).send(error.message);

        await this.collection.updateOne({
            _id: new ObjectId(id),
            userId: new ObjectId(userId)
        },
        {
            $set: {
                ...updatedProduct
            }
        });

        return res.status(StatusCode.NO_CONTENT).send();

    }

    async deleteOne(req: Request, res: Response): Promise<Response> {
        const userId = req.user as string;
        const id = req.params.id;
        const product: Product | null = await this.collection.findOne({
            _id: new ObjectId(id),
            userId: new ObjectId(userId)
        });

        if (!product) 
            return res.status(StatusCode.NOT_FOUND).send();

        await this.collection.deleteOne({
            _id: new ObjectId(id),
            userId: new ObjectId(userId)
        });
        
        return res.status(StatusCode.NO_CONTENT).send();
    }
}
