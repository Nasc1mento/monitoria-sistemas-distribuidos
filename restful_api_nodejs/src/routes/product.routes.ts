import{ Router, Request, Response } from 'express';
import { ProductController } from '../controllers/product.controller';
import asyncCall from '../utils/async-call';

export class ProductRouter {
    private controller: ProductController
    private router: Router;

    constructor(router: Router) {
        this.controller = new ProductController();
        this.router = router;
    }

    setRoutes() {
        this.router.post('/products', (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.insertOne.bind(this.controller));
        });

        this.router.get('/products', (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.getAll.bind(this.controller));
        });

        this.router.get('/products/:id', (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.getOne.bind(this.controller));
        });

        this.router.put('/products/:id', (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.updateOne.bind(this.controller));
        });

        this.router.delete('/products/:id', (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.deleteOne.bind(this.controller));
        });     
    }
}