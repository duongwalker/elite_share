import express, { Request, Response } from "express"
import { authenticateUser } from "../middlewares/verifyToken"


const authenticateRouter = express.Router()

authenticateRouter.post("/authenticate", authenticateUser)