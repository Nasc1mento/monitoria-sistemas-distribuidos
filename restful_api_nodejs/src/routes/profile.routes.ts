import { Request, Response, Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { ProfileController } from "../controllers/profile.controller";
import { asyncCall } from "../utils/async-call";


export class ProfileRoutes {
    
    public router: Router;
    private profileController: ProfileController;
    private path: string;

    constructor(router: Router) {
        this.profileController = new ProfileController();
        this.router = router;
        this.path = '/me';
    }

    setRoutes() {
        this.router.get(`${this.path}`, authMiddleware, (req: Request, res: Response) => {
            asyncCall(req, res, this.profileController.getProfile.bind(this.profileController));
        });
        
        this.router.put(`${this.path}`, authMiddleware, (req: Request, res: Response) => {
            asyncCall(req, res, this.profileController.updateProfile.bind(this.profileController));
        });

        this.router.delete(`${this.path}`, authMiddleware, (req: Request, res: Response) => {
            asyncCall(req, res, this.profileController.deleteProfile.bind(this.profileController));
        });
    }
}