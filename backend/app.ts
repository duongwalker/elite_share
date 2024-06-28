import express from "express"
import userRouter from "./routers/userRouter";
import groupRouter from "./routers/groupRouter";
import cors from 'cors';
import loginRouter from "./routers/loginRouter";
const app = express();

app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(groupRouter);
app.use(loginRouter)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
