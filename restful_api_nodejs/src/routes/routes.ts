import { Router, Request, Response } from "express";
import { ProductRouter } from "./product.routes";

export class ApiRoutes {

    private router: Router

    constructor() {
        this.router = Router();  
    }

    init(): Router {
        this.getAPIStatusRoute();
        this.setRoutes();
        return this.router;
    }

    getAPIStatusRoute(): void {
        this.router.get('/', (req: Request, res: Response) => {
            res.send(
                {   
                    uptime: Math.floor(process.uptime()),
                    message: 'Acordado'
                }
            )
        });
    }

    setRoutes(): void {
        new ProductRouter(this.router).setRoutes();
    }
}