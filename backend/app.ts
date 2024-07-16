import express from "express"
import userRouter from "./routers/userRouter";
import groupRouter from "./routers/groupRouter";
import cors from 'cors';
import loginRouter from "./routers/loginRouter";
import errorHandler from "./middlewares/errorHandler";
const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(groupRouter);
app.use(loginRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
