import Joi from "joi";
import { CreateProductDTO, UpdateProductDTO } from "../models/product.model";

export const createProductSchema = Joi.object<CreateProductDTO>({
    name: Joi.string().min(3).required(),
    price: Joi.number().required()
});

export const updateProductSchema = Joi.object<UpdateProductDTO>({
    name: Joi.string().min(3).optional(),
    price: Joi.number().optional()
});
