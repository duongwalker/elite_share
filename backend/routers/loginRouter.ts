import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import express, { Request, Response } from "express"
import { User } from "../models/user.model"
import { getUserById, getUserByName } from "../controllers/user.controller"
import { authMiddleware } from "../middlewares/authMiddleware"
const loginRouter = express.Router()

loginRouter.post("/login", async (request, response) => {
  const { name, password } = request.body

  const user = await getUserByName(name)
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    response.status(401).json({
      error: "invalid username or password",
    })
  }
  if (user) {
    const userForToken = {
      username: user.name,
      id: user.id,
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("Missing ACCESS_TOKEN_SECRET environment variable")
    }

    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET)

    response.status(200).send({ accessToken, name: user.name })
  }
})

export default loginRouter
