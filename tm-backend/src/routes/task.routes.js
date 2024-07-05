import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {createTask, getTaskById, changeTaskStatus} from "../controllers/task.controller.js"

const router = Router();

router.route("/create").post(verifyJWT, createTask);
router.route("/:taskId").get(verifyJWT, getTaskById);
router.route("/:taskId").patch(verifyJWT, changeTaskStatus);


export default router;