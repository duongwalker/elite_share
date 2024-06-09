import express from "express"
import userRouter from "./routers/userRouter";
import groupRouter from "./routers/groupRouter";
const app = express();

app.use(express.json());

app.use(userRouter);
app.use(groupRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
