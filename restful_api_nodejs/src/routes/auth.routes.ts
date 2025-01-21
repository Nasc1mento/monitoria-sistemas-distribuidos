import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { asyncCall } from '../utils/async-call';


export class AuthRoutes {

    private router: Router
    private controller: AuthController
    private path: string;

    constructor(router: Router) {
        this.controller = new AuthController();  
        this.router = router;
        this.path = '/auth';
    }

    setRoutes() {
        this.router.post(`${this.path}/register`, (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.register.bind(this.controller));
        });

        this.router.post(`${this.path}/login`, (req: Request, res: Response) => {
            asyncCall(req, res, this.controller.login.bind(this.controller));
        });
    }
}