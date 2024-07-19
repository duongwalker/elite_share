import pool from "../db/connection"
import { User } from "../models/user.model"
import { Group } from "../models/group.model"

type UserId = number
type GroupId = number

export async function getAllGroups() {
  const [rows] = await pool.query("SELECT * FROM `groups`")
  return rows as Group[]
}

export async function getGroupById(id: number) {
  const [rows] = await pool.query("SELECT * FROM `groups` WHERE group_id = ?", [
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
      "INSERT INTO `groups` (group_name, created_by) VALUES (?, ?)",
      [group_name, created_by]
    )
    const insertedGroupId = (result as any).insertId
    return { id: insertedGroupId, group_name, created_by }
  } catch (err) {
    console.error("Error creating group:", err)
  }
}

export async function deleteGroup(group_id: GroupId) {
  //ADD Authenticate User MIDDLEWARE
  try {
    const [result] = await pool.query("DELETE FROM `groups` WHERE group_id=?", [
      group_id,
    ])
    return { group_id }
  } catch (err) {
    console.error("Error creating group:", err)
  }
}

export async function getAllUserFromGroup(groupId: GroupId) {
  try {
    await pool.query(
      `SELECT u.name, g.group_name
      FROM users u
      JOIN group_members gm ON u.user_id = gm.user_id
      JOIN \`groups\` g ON gm.group_id = g.group_id
      WHERE gm.group_id = ?;
`,
      [groupId]
    )
  } catch (err) {
    console.error("Error:", err)
  }
}

export async function addUserToGroup(group_id: GroupId, user_id: UserId) {
  try {
    await pool.query(
      "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
      [group_id, user_id]
    )
    const updatedGroup = getGroupById(group_id)
    return updatedGroup
  } catch (err) {
    console.error("Error creating group:", err)
  }
}

export async function deleteUserFromGroup(group_id: GroupId, user_id: UserId) {
  try {
    await pool.query(
      "DELETE FROM group_members WHERE group_id = ? AND user_id = ?",
      [group_id, user_id]
    )
    const updatedGroup = getGroupById(group_id)
    return updatedGroup
  } catch (err) {
    console.error("Error creating group:", err)
  }
}

export async function getGroupsByUserId(user_id: number) {
  const [rows] = await pool.query(
    `
  SELECT \`groups\`.group_id, \`groups\`.group_name
  FROM (
    (users
    INNER JOIN group_members ON users.user_id = group_members.user_id)
    INNER JOIN \`groups\` ON \`groups\`.group_id = group_members.group_id
  )
  WHERE users.user_id = ?;
`,
    [user_id]
  )
  if (Array.isArray(rows) && rows.length > 0) {
    // const groupNames = rows.map((row: any) => row.group_name)
    // console.log(groupNames)
    return rows
  }
  return null
}

export async function getExpensesInfoByGroupId(group_id: number, user_id: number) {
  const [rows] = await pool.query(
    `SELECT
    e.group_id,
    e.date,
    e.description,
    e.amount,
    u.name AS creator_name,
    us.name AS sharer_name,
    es.share_amount
FROM
    expenses e
JOIN
    users u ON e.created_by = u.user_id
JOIN
    expense_shares es ON e.expense_id = es.expense_id
JOIN
    users us ON es.user_id = us.user_id
WHERE
    e.group_id = ?
AND
    us.user_id = ?;
`,
  [group_id, user_id]
  )
  if (Array.isArray(rows) && rows.length > 0) {
    // const groupNames = rows.map((row: any) => row.group_name)
    // console.log(groupNames)
    return rows
  }
  return null
}
