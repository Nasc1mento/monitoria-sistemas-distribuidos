import { MongoClient } from "mongodb";
import { env } from "../env";


export class MongoConnection {

    private static instance: MongoConnection;
    private client: MongoClient;

    private constructor() {
        this.client = new MongoClient(this.getUri())
    }

    public static getInstance(): MongoConnection {
        if (!MongoConnection.instance) 
            MongoConnection.instance = new MongoConnection()

        return MongoConnection.instance;
    }

    private getUri(): string {
        return env.MONGO_URI;
    }

    public getClient(): MongoClient {
        return this.client;
    }    

    async connect(): Promise<void> {
        try {
            await this.client.connect();
        } catch (error: any) {
            throw new Error(error);
        }
    }
    async close(): Promise<void> {
        try {
            await this.client.close();
        } catch (error: any) {
            throw new Error(error);
        }
    }
}