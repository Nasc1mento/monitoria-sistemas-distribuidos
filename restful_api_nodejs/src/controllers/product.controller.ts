import { Request, Response } from "express"
import {StatusCode} from "../constants/status-code";
import { Product, toProductResponse } from "../models/product.model";
import { User } from "../models/user.model";
import { ProductRepository } from "../repositories/product.repository";


export class ProductController {

    private repository: ProductRepository;

    constructor() {
        this.repository = new ProductRepository();
    }

    async insertOne(req: Request, res: Response): Promise<Response> {
        const {_id: userId} = req.user as User
        const product: Product = req.body;
        const savedProduct = await this.repository.insertOne(String(userId), {
            ...product,
            userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.status(StatusCode.CREATED).json(savedProduct);
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        const {_id: userId} = req.user as User
        const lastId = String(req.query.lastId)
        const limit = Number(req.query.limit);
        const sort = String(req.query.sort);
        const dir = String(req.query.dir) === '1' ? 1 : -1;
        const products: Product[] = await this.repository.findAll(
            String(userId), 
            lastId, 
            limit, 
            {[sort]: dir}
        );

        return res.status(StatusCode.OK).json(products);
    }

    async getOne(req: Request, res: Response): Promise<Response> {
        const {_id: userId} = req.user as User
        const id = String(req.params.id);
        const product: Product | null = await this.repository.findOne(String(userId), id);
        if (!product)
            return res.status(StatusCode.NOT_FOUND).send();

        return res.status(200).json(toProductResponse(product));
    }

    async updateOne(req: Request, res: Response): Promise<Response> {
        const {_id: userId} = req.user as User
        const id = req.params.id;
        const product: Product = req.body;

        const productExists: Product | null = await this.repository.findOne(String(userId),id);
        if (!productExists) 
            return res.status(StatusCode.NOT_FOUND).send();

        await this.repository.updateOne(String(userId), id, {
            ...product,
            updatedAt: new Date()
        });

        return res.status(StatusCode.NO_CONTENT).send();
    }

    async deleteOne(req: Request, res: Response): Promise<Response> {
        const {_id: userId} = req.user as User
        const id = req.params.id;
        const product: Product | null = await this.repository.findOne(String(userId), id);
        if (!product) 
            return res.status(StatusCode.NOT_FOUND).send();
        
        await this.repository.removeOne(String(userId), id);
        
        return res.status(StatusCode.NO_CONTENT).send();
    }
}
