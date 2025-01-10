import { Request, Response } from "express"
import { ProductRepository } from "../repositories/product.repository";
import { StatusCode } from "../constants/status-code";


export class ProductController {

    private repository: ProductRepository;

    constructor() {
        this.repository = new ProductRepository();
    }

    async insertOne(req: Request, res: Response): Promise<Response> {
        const product = req.body;
        const newProduct = await this.repository.insertOne(product);

        return res.status(StatusCode.CREATED).json(newProduct);
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        const lastId = String(req.query.lastId)
        const limit = Number(req.query.limit);
        const sort = String(req.query.sort);
        const dir = req.query.dir === '1' ? 1 : -1;
        const products = await this.repository.findAll(lastId, limit, { [sort]: dir });

        return res.status(StatusCode.OK).json(products);
    }

    async getOne(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        const product = await this.repository.findOne(id);
        if (!product)
            return res.status(StatusCode.NOT_FOUND).send();

        return res.status(200).json(product);
    }

    async updateOne(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        const product = req.body;

        const productExists = await this.repository.findOne(id);
        if (!productExists) 
            return res.status(StatusCode.NOT_FOUND).send();

        await this.repository.updateOne(id, product);

        return res.status(StatusCode.NO_CONTENT).send();
    }

    async deleteOne(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        const product = await this.repository.findOne(id);
        if (!product) 
            return res.status(StatusCode.NOT_FOUND).send();
        
        await this.repository.removeOne(id);
        
        return res.status(StatusCode.NO_CONTENT).send();
    }
}