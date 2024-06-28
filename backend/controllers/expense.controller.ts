import pool from "../db/connection"
import { Expense } from "../models/expense.model";

export async function getAllExpenses() {
    const [rows] = await pool.query("SELECT * FROM `groups`")
    return rows as Expense[];
  }