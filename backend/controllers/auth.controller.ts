import { Request, Response, NextFunction } from "express";
import { getUserByEmail } from "./user.controller";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const userLogin = async (req:Request, res:Response, next: NextFunction) => {
    try {
        if(!req.body.email || !req.body.password) {
            res.status(400).json('username or password is missing')
        }
            const { email, password } = req.body

            const user = await getUserByEmail(email)

            // If the user exists
            if (user !== null) {
              const passwordCorrect = await bcrypt.compare(password, user.password)

              if (!passwordCorrect) {
                res.status(401).json({
                  error: "invalid email or password",
                })
              }
              const userForToken = {
                username: user.name,
                id: user.user_id,
              }

              if (!process.env.ACCESS_TOKEN_SECRET) {
                throw new Error("Missing ACCESS_TOKEN_SECRET environment variable")
              }

              const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60*60  })
              const returnedUserWithToken = {accessToken, id: user.user_id, name: user.name}


              // res.status(200).json({ accessToken: accessToken, name: user.name })
              res.status(200).json(returnedUserWithToken)

              console.log(accessToken)

            } else {
             res.status(404).json({ error: "user not found" })
            }
          }
    catch(err) {
        next(err)
    }
}
