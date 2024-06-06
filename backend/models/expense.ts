import pool from "../db/connection"

interface Expense {
  expense_id: number
  group_id: number | null
  created_by: number
  amount: number
  description: string
}

export async function getAllExpenses() {
    const [rows] = await pool.query("SELECT * FROM groups")
    return rows as Expense[];
  }