import { Router, Request, Response } from "express";
import { ProductRouter } from "./product.routes";
import { AuthRoutes } from "./auth.routes";
import { ProfileRoutes } from "./profile.routes";

class ApiRoutes {

    private router: Router
    private path: string;

    constructor() {
        this.router = Router();  
        this.path = '/';
    }

    init(): Router {
        this.getAPIStatusRoute();
        this.setRoutes();
        return this.router;
    }

    getAPIStatusRoute(): void {
        this.router.get(this.path, (req: Request, res: Response) => {
            res.send(
                {   
                    uptime: Math.floor(process.uptime()),
                    message: 'Acordado'
                }
            )
        });
    }

    setRoutes(): void {
        new AuthRoutes(this.router).setRoutes();
        new ProductRouter(this.router).setRoutes();
        new ProfileRoutes(this.router).setRoutes();
    }
}

export default ApiRoutes;