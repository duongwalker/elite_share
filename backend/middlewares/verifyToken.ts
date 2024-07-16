import { Request, Response, NextFunction } from "express"
import config from "./config"
import jwt, { UserJwtPayload } from "jsonwebtoken"
import { UserRequest } from "../types/user"

export const verifyToken = (token: string) => {
  if (!config.ACCESS_TOKEN_SECRET) {
    throw new Error("Token secret not provided");
  }
  return jwt.verify(token, config.ACCESS_TOKEN_SECRET) as UserJwtPayload;
}

export const authenticateUser = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader: string | undefined = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(" ")[1]
    console.log('token')
    console.log(token)
    try {
      const user = verifyToken(token)
      req.user = user.id
      next()
    } catch (err) {
      console.log('error')
      console.log(err)
      next(err) // Pass the error to the error handler middleware
    }
  }
  else {
    res.status(401).json(`You are not authenticated!`);
}
}
