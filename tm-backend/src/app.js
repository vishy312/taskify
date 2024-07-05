import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))


app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));


import userRouter from "./routes/user.routes.js"
import projectRouter from "./routes/project.routes.js"
import taskRouter from "./routes/task.routes.js"


app.use("/api/v1/users", userRouter)
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/tasks", taskRouter)

export default app