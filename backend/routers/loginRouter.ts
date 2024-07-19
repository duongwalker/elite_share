
import express from "express"

import { userLogin } from "../controllers/auth.controller"
const loginRouter = express.Router()

// Login user, issue JWT
loginRouter.post("/api/login", userLogin)



export default loginRouter
