import { Request, Response, NextFunction } from "express"
import config from "./config"
import jwt,{ UserJwtPayload} from "jsonwebtoken"
import { UserRequest } from "../types/user"


export const verifyToken = (token:string) => {
    try {
        if(config.ACCESS_TOKEN_SECRET) {
            const {id} = <UserJwtPayload>jwt.verify(token, config.ACCESS_TOKEN_SECRET)
            return {id}
        }
    }
    catch(err) {
        return undefined
    }
}


export const authenticateUser = (req:UserRequest, res:Response, next:NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if(authHeader) {
            const token = authHeader.split(' ')[1]
            req.user=verifyToken(token)
            next()
        }
    }
    catch(err) {
        res.status(401).json('Invalid token!');
    }
}