import express, { Request, Response } from "express"
import { Group } from "../models/group.model"
import {
  getAllGroups,
  getGroupById,
  createGroup,
  addUserToGroup,
  deleteUserFromGroup,
  deleteGroup,
  getGroupsByUserId,
  getExpensesInfoByGroupId,
  getAllUsersFromGroup,
  updateGroupName,
} from "../controllers/group.controller"

import { authenticateUser, verifyToken } from "../middlewares/verifyToken"
import { UserRequest } from "../types/user"

const groupRouter = express.Router()


// Get all group information
groupRouter.get(
  "/groups",
  authenticateUser,
  async (req: UserRequest, res: Response) => {
    const groups = await getAllGroups()
    res.status(200).json(groups)
  }
)

// Get groupIds and groupNames by userId
groupRouter.get(
  "/user-groups/:userId",
  authenticateUser,
  async (req: UserRequest, res: Response) => {
    const id = parseInt(req.params.userId)
    const groups = await getGroupsByUserId(id)
    res.json(groups)
  }
)

// Get all group information by group_id
groupRouter.get(
  "/groups/:id",

  async (req: UserRequest, res: Response) => {
    const id = parseInt(req.params.id)
    const group = await getGroupById(id)
    if (group) {
      res.json(group)
    } else {
      res.status(404).json({ message: "Group not found" })
    }
  }
)

groupRouter.get(
  "/groups/:group_id/expenses",
  authenticateUser,
  async (req: UserRequest, res: Response) => {

    const user = req.user
    const group_id = parseInt(req.params.group_id)
    try {
      const expenses = await getExpensesInfoByGroupId(group_id, Number(user))

      if (expenses) {
        res.status(200).json(expenses)
      } else {
        res.status(404).json({ message: "No expenses found for this group" })
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while fetching expenses", error })
    }
  }
)


// Get all members of a group by group id
groupRouter.get(
  "/groups/:group_id/members",
  authenticateUser,
  async (req: UserRequest, res: Response) => {

    const user = req.user
    const group_id = parseInt(req.params.group_id)
    try {
      const members = await getAllUsersFromGroup(group_id)

      if (members) {
        res.status(200).json(members)
      } else {
        res.status(404).json({ message: "No member found for this group" })
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while fetching expenses", error })
    }
  }
)



// Create a new group
groupRouter.post(
  "/groups",
  authenticateUser,
  async (req: UserRequest, res: Response) => {
    try {
      const newGroup: Group = req.body
      const createdGroup = await createGroup(newGroup)

      if (!createdGroup || !createdGroup.id) {
        res.status(500).json({ message: "Failed to create group" });
        return;
      }

      await addUserToGroup(createdGroup.id, createdGroup.created_by);
      res.status(201).json(createdGroup)

    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message })
      } else {
        res.status(500).json({ message: "An unknown error occurred" })
      }
    }
  }
)

// Update a group name
groupRouter.put(
  "/groups/:id",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {

      const group_id = parseInt(req.params.id)
      const newGroupInfo: Group = req.body

      const updatedGroup = await updateGroupName(group_id, newGroupInfo)
      res.status(201).json(updatedGroup)
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message })
      } else {
        res.status(500).json({ message: "An unknown error occurred" })
      }
    }
  }
)

// Delete a group with group id
groupRouter.delete(
  "/groups/:id",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {

      const group_id = parseInt(req.params.id)
      const deletedGroup = await deleteGroup(group_id)
      res.status(200).json(deletedGroup)
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message })
      } else {
        res.status(500).json({ message: "An unknown error occurred" })
      }
    }
  }
)

groupRouter.post(
  "/groups/:group_id/addUser",
  async (req: Request, res: Response) => {
    const user_id = parseInt(req.body.user_id)
    const group_id = parseInt(req.params.group_id)
    if (!user_id) {
      res.status(400).json({ error: "user_id is required" })
    }
    try {
      const result = await addUserToGroup(group_id, user_id)
      res.status(201).json(result)
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message })
      } else {
        res.status(500).json({ message: "An unknown error occurred" })
      }
    }
  }
)

groupRouter.delete(
  "/groups/:group_id/deleteUser/:user_id",
  async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.user_id)
    const group_id = parseInt(req.body.group_id)
    if (!user_id) {
      res.status(400).json({ error: "user_id is required" })
    }
    try {
      const result = await deleteUserFromGroup(group_id, user_id)
      res.status(200).json(result)
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message })
      } else {
        res.status(500).json({ message: "An unknown error occurred" })
      }
    }
  }
)


export default groupRouter
