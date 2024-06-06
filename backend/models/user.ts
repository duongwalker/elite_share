import pool from "../db/connection"
import bcrypt from "bcrypt"

export interface User {
  id: number
  name: string
  email: string
  password: string
}

export async function getAllUsers() {
  const [rows] = await pool.query("SELECT * FROM users")
  return rows as User[]
}

export async function getUserById(id: number) {
  const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [id])
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0] as User
  }
  return null
}

export async function createUser(user: User) {
  try {
    const { name, email, password } = user
    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    )
    const insertedUserId = (result as any).insertId
    return { id: insertedUserId, name, email, password }
  } catch (err) {
    console.error("Error creating group:", err)
  }
}
