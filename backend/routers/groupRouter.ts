import express, { Request, Response } from "express"
import { Group, getAllGroups, getGroupById, createGroup } from "../models/group"

const groupRouter = express.Router()

groupRouter.get("/groups", async (req: Request, res: Response) => {
  const groups = await getAllGroups
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
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: "An unknown error occurred" })
    }
  }
})

export default groupRouter
