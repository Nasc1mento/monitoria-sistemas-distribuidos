import Joi from "joi";
import { UpdateUserDTO } from "../models/user.model";

export const updateUserSchema = Joi.object<UpdateUserDTO>({
    name: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).max(20).optional()
});