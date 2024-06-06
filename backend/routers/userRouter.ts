import express, { Request, Response } from "express"
import { User, getAllUsers, getUserById, createUser } from "../models/user"

const userRouter = express.Router()

userRouter.get("/users", async (req: Request, res: Response) => {
  const users = await getAllUsers()
  res.json(users)
})

userRouter.get("/users/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const user = await getUserById(id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: "User not found" })
  }
})

userRouter.post("/users", async (req: Request, res: Response) => {
  try {
    const newUser: User = req.body
    const createdUser = await createUser(newUser)
    res.status(201).json(createdUser)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: "An unknown error occurred" })
    }
  }
})



export default userRouter
