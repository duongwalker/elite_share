import express, { Request, Response } from "express"
import { authenticateUser, verifyToken } from "../middlewares/verifyToken"
import { Expense } from "../models/expense.model"
import { UserRequest } from "../types/user"
import {
  createExpense,
  getTransactionsByGroupId,
} from "../controllers/expense.controller"

const expenseRouter = express.Router()

expenseRouter.post(
  "/expenses",
  authenticateUser,
  async (req: UserRequest, res: Response) => {
    try {
      const reqExpense: Expense = req.body
      const newExpense = { ...reqExpense, date: new Date(reqExpense.date) }
      console.log(newExpense)
      const createdExpense = await createExpense(newExpense)
      console.log(createdExpense)
      if (!createdExpense) {
        res.status(500).json({ message: "Failed to create expense" })
        return
      }
      res.status(201).json(createdExpense)
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message })
      } else {
        res.status(500).json({ message: "An unknown error occurred" })
      }
    }
  }
)

expenseRouter.post(
  "/settle-up",
  authenticateUser,
  async (req: UserRequest, res: Response) => {
    const group_id = req.body.group_id
    const users = await getTransactionsByGroupId(group_id)

    res.json(users)
  }
)

export default expenseRouter
