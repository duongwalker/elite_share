import pool from "../db/connection"
import { Expense } from "../models/expense.model"
import { settleDebts } from "../utils/settleDebts"

interface ExpenseShare {
  user_id: number
  name: string
  share_amount: number
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
      `SELECT expenses.expense_id, expenses.created_by, expenses.amount, users.name
      FROM (expenses JOIN users ON expenses.created_by=users.user_id)
      WHERE group_id = ?`,
      [groupId]
    )
    let users: ExpenseShare[] = []

    if (Array.isArray(expenseResults) && expenseResults.length > 0) {
      const convertedExpenseResults = expenseResults as Array<Expense>
      convertedExpenseResults.forEach((result) => {
        if(result.name) {
          const userId = result.created_by
          const amount = Number(result.amount) // Convert the amount to a number
          const userName = result.name
          const user = users.find((user) => user.user_id === userId)
          if (user) {
            user.share_amount += amount // Add the amount if the user already exists in the object
          } else {
            users.push({
              user_id: userId,
              name: userName,
              share_amount: amount,
            }) // Initialize the user with the amount if not present
          }
        }
      })
      const expense_ids = convertedExpenseResults.map(
        (result) => result.expense_id
      )
      const queryPlaceholders = expense_ids.map(() => "?").join(", ")

      // for (const expense of convertedResults) {
      // }
      const [expenseShareResults] = await pool.query(
        `SELECT expense_shares.user_id, expense_shares.share_amount, users.name
        FROM (expense_shares JOIN users ON expense_shares.user_id=users.user_id)
        WHERE expense_id IN (${queryPlaceholders})`,
        expense_ids
      )

      const convertedExpenseShareResults = expenseShareResults as Array<ExpenseShare>

      convertedExpenseShareResults.forEach((result) => {
        const userId = result.user_id
        const amount = Number(result.share_amount) // Convert the amount to a number
        const userName = result.name
        const user = users.find((user) => user.user_id === userId)
        if (user) {
          user.share_amount -= amount // Add the amount if the user already exists in the object
        } else {
          users.push({
            user_id: userId,
            name: userName,
            share_amount: -amount,
          }) // Initialize the user with the amount if not present
        }
      })
      console.log(users)
      const transactions = settleDebts(users)

      return transactions
    }
  } catch (err) {
    console.error("Error fetching expenses:", err)
  }
}