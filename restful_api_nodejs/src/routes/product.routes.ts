import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/product.controller';
import { asyncCall } from '../utils/async-call';
import { authMiddleware } from '../middleware/auth.middleware';

export class ProductRouter {
    private controller: ProductController
    private router: Router;
    private path: string;

    constructor(router: Router) {
        this.controller = new ProductController();
        this.router = router;
        this.path = '/products';
    }

    setRoutes() {

        this.router.post(`${this.path}`, authMiddleware, (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.insertOne.bind(this.controller));
        });

        this.router.get(`${this.path}`, authMiddleware, (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.getAll.bind(this.controller));
        });

        this.router.get(`${this.path}/:id`, authMiddleware, (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.getOne.bind(this.controller));
        });

        this.router.put(`${this.path}/:id`, authMiddleware,(req: Request, res: Response) => {
            asyncCall(req, res, this.controller.updateOne.bind(this.controller));
        });

        this.router.delete(`${this.path}/:id`, authMiddleware,(req: Request, res: Response) => {
            asyncCall(req, res, this.controller.deleteOne.bind(this.controller));
        });     
    }
}