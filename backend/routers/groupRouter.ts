import express, { Request, Response } from "express"
import { Group } from "../models/group.model"
import {
  getAllGroups,
  getGroupById,
  createGroup,
  addUserToGroup,
  deleteUserFromGroup,
  deleteGroup,
} from "../controllers/group.controller"

const groupRouter = express.Router()

groupRouter.get("/groups", async (req: Request, res: Response) => {
  const groups = await getAllGroups()
  res.json(groups)
})

groupRouter.get("/groups/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const group = await getGroupById(id)
  if (group) {
    res.json(group)
  } else {
    res.status(404).json({ message: "Group not found" })
  }
})

groupRouter.post("/groups", async (req: Request, res: Response) => {
  try {
    const newGroup: Group = req.body
    const createdGroup = await createGroup(newGroup)
    res.status(201).json(createdGroup)
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message })
    } else {
      res.status(500).json({ message: "An unknown error occurred" })
    }
  }
})

groupRouter.delete("/groups/:id", async (req: Request, res: Response) => {
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
})

groupRouter.post(
  "/groups/:group_id/addUser",
  async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.user_id)
    const group_id = parseInt(req.body.group_id)
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" })
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
      return res.status(400).json({ error: "user_id is required" })
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

groupRouter.get(
  "/groups/:group_id/deleteUser",
  async (req: Request, res: Response) => {}
)

export default groupRouter
