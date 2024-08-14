import pool from "../db/connection"
import { Expense } from "../models/expense.model"
import { settleDebts } from "../utils/settleDebts"

interface ExpenseShare {
  user_id: number
  share_amount: string
}

export async function createExpense(expense: Expense) {
  const { group_id, created_by, amount, description, shares, date } = expense
  try {
    const [result] = await pool.query(
      "INSERT INTO expenses (group_id, created_by, amount, description, date) VALUES (?, ?, ?, ?, ?)",
      [group_id, created_by, amount, description, date]
    )
    const insertedExpenseId = (result as any).insertId
    if (shares) {
      for (const share of shares) {
        await pool.query(
          "INSERT INTO expense_shares (expense_id, user_id, share_amount) VALUES (?, ?, ?)",
          [insertedExpenseId, share.user_id, share.amount]
        )
      }
    }
    return { insertedExpenseId, description, amount }
  } catch (err) {
    console.error("Error creating expense:", err)
  }
}

export async function getTransactionsByGroupId(groupId: number) {
  try {
    const [expenseResults] = await pool.query(
      "SELECT expense_id, created_by, amount FROM expenses WHERE group_id = ?",
      [groupId]
    )
    // console.log("results")
    // console.log(results)
    let users: { [id: number]: number } = {}

    if (Array.isArray(expenseResults) && expenseResults.length > 0) {
      const convertedExpenseResults = expenseResults as Array<Expense>
      convertedExpenseResults.forEach((result) => {
        const userId = result.created_by
        const amount = Number(result.amount) // Convert the amount to a number
        if (users[userId]) {
          users[userId] += amount // Add the amount if the user already exists in the object
        } else {
          users[userId] = amount // Initialize the user with the amount if not present
        }
      })
      const expense_ids = convertedExpenseResults.map(
        (result) => result.expense_id
      )
      const queryPlaceholders = expense_ids.map(() => "?").join(", ")

      // for (const expense of convertedResults) {
      // }
      const [expenseShareResults] = await pool.query(
        `SELECT user_id, share_amount FROM expense_shares WHERE expense_id IN (${queryPlaceholders})`,
        expense_ids
      )

      const convertedExpenseShareResults = expenseShareResults as Array<ExpenseShare>
      convertedExpenseShareResults.forEach((result) => {
        const user_id = result.user_id
        const amount = Number(result.share_amount)
        if (users[user_id]) {

          users[user_id] -= amount // Add the amount if the user already exists in the object
        } else {

          users[user_id] = -amount // Initialize the user with the amount if not present
        }
      })
      const transactions = settleDebts(users)

      return transactions
    }
  } catch (err) {
    console.error("Error fetching expenses:", err)
  }
}
