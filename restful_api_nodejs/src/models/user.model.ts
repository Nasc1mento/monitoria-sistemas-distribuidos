import Joi from 'joi';
import { ObjectId } from 'mongodb';

export type userID = ObjectId;

export interface User {
    _id: ObjectId | string;
    name: string;
    email: string;
    password: string;
}

export type UserDTO = Omit<User, 'password'>;
export type LoginDTO = Pick<User, 'email' | 'password'>;
export type CreateUserDTO = Omit<User, '_id'>;
export type UpdateUserDTO = Partial<CreateUserDTO>;

export function toUserDTO(user: User): UserDTO {
    return {
        _id: user._id,
        name: user.name,
        email: user.email
    }
}


