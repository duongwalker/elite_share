import pool from "../db/connection"
import bcrypt from "bcrypt"
import { User } from "../models/user.model"

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

export async function getUserByName(name: string) {
  const [rows] = await pool.query("SELECT * FROM users WHERE name = ?", [name])
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0] as User
  }
  return null
}

export async function getUserByEmail(email: string) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0] as User
  }
  return null
}

export async function createUser(user: User) {
  try {
    const { name, email, password } = user
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
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


