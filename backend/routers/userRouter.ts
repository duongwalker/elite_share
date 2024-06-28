import express, { Request, Response } from "express"
import { User } from "../models/user.model"
import {
  getAllUsers,
  getUserById,
  createUser,
} from "../controllers/user.controller"
const userRouter = express.Router()

userRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers()
    if (users && users.length > 0) {
      res.json(users)
    } else {
      res.status(404).json({ message: "No users found" })
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "An error occurred while fetching users",
        error: error.message,
      })
    } else {
      res.status(500).json({ message: "An unknown error occurred" })
    }
  }
})

userRouter.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const user = await getUserById(id)
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "An error occurred while fetching users",
        error: error.message,
      })
    } else {
      res.status(500).json({ message: "An unknown error occurred" })
    }
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
