import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) {
    return res.status(401).json({
      error: "Token is not available",
    })
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    else {
      return res.json({ user })
    }
    next()
  })
}
