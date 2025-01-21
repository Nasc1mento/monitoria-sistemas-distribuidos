import Joi from "joi";
import { CreateUserDTO } from "../models/user.model";

export const createUserSchema = Joi.object<CreateUserDTO>({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required()
});
