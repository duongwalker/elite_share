import * as jwt from 'jsonwebtoken'
import { Request } from 'express'




export type decodedUser = {
   id: string,
}
declare module 'jsonwebtoken' {
    export interface UserJwtPayload extends jwt.JwtPayload {
        user: decodedUser
    }
}

export interface UserRequest extends Request {
    // req: jwt.UserJwtPayload
    user?: decodedUser
}
