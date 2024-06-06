import pool from "../db/connection"
import { User } from "./user"

export interface Group {
  group_id: number
  group_name: string
  created_by: number // FK to Users
}

type UserId = number
type GroupId = number

export async function getAllGroups() {
  const [rows] = await pool.query("SELECT * FROM groups")
  return rows as Group[]
}

export async function getGroupById(id: number) {
  const [rows] = await pool.query("SELECT * FROM groups WHERE group_id = ?", [
    id,
  ])
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0] as Group
  }
  return null
}

export async function createGroup(group: Group) {
  //ADD Authenticate User MIDDLEWARE
  const { group_name, created_by } = group
  try {
    const [result] = await pool.query(
      "INSERT INTO groups (group_name, created_by) VALUES (?, ?)",
      [group_name, created_by]
    )
    const insertedGroupId = (result as any).insertId
    return { id: insertedGroupId, group_name, created_by }
  } catch (err) {
    console.error("Error creating group:", err)
  }
}

export async function addUserToGroup(group_id: GroupId, user_id: UserId) {
  try {
    const [result] = await pool.query(
      "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
      [group_id, user_id]
    )
    return { group_id, user_id }
  } catch (err) {
    console.error("Error creating group:", err)
  }
}
