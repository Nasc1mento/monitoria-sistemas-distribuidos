import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface UserResponse {
    _id?: ObjectId;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export function toUserResponse(user: User): UserResponse {
    return {
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}