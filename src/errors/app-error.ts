import { ms } from "zod/locales";

export class AppError extends Error{
    constructor(msg:string, 
        statusCode:number = 400){
            super(msg)
    }
}