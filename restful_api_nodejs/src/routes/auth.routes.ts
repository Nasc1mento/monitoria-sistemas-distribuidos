import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";
import { asyncCall } from "../utils/async-call";


export class AuthRoutes {

    private router: Router
    private controller: AuthController

    constructor(router: Router) {
        this.controller = new AuthController();  
        this.router = router;
        this.router.use('/auth', this.router);
    }

    setRoutes() {
        this.router.post('/register', (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.register.bind(this.controller));
        });

        this.router.post('/login', (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.login.bind(this.controller));
        });
    }
}