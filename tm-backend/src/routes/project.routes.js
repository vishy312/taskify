import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js"
import { createProject, getProjectById, deleteProjectById } from "../controllers/project.controller.js";

const router = Router();

router.route("/create-project").post(verifyJWT, createProject)
router.route("/:projectId").get(verifyJWT, getProjectById)
router.route("/:projectId").delete(verifyJWT, deleteProjectById)


export default router