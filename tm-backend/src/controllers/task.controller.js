import { priorityValues } from "../constants.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

const createTask = asyncHandler(async (req, res) => {
  const assigner = req.user;
  if (!assigner) {
    throw new ApiError("something went wrong", 401);
  }

  const { title, description, duedate, priority, assignedTo, project } =
    req.body;

  if ([title, priority, duedate].some((field) => field.trim() === "")) {
    throw ApiError(
      "title, project, duedate, or priority field(s) is/are empty",
      400
    );
  }

  if (!project) {
    throw new ApiError("project field is mandatory", 400);
  }

  const taskProject = await Project.findById(project._id);
  if (!taskProject) {
    throw new ApiError("invalid project", 400);
  }

  if (!priorityValues.includes(priority)) {
    throw new ApiError(
      "priority value should be one of the selected options",
      400
    );
  }

  const assignedToUser = await User.findById(assignedTo._id);
  if (!assignedToUser) {
    throw new ApiError("assignedTo user value is invalid", 400);
  }

  const createdTask = await Task.create({
    title,
    description,
    duedate,
    project,
    priority,
    status: "Todo",
    assignedTo: assignedToUser,
    assigner,
  });

  return res
    .status(201)
    .json(new ApiResponse("task created successfully", 201, createdTask));
});

const getTaskById = asyncHandler(async (req, res) => {
  const {taskId} = req.params

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError("Invalid task ID", 400)
  }

  return res
  .status(200)
  .json(
    new ApiResponse("Task fetched.", 200, task)
  )
})

const changeTaskStatus = asyncHandler(async(req, res) => {
  const {taskId} = req.params

  const {status} = req.body


  const task = await Task.findByIdAndUpdate(taskId, {status});

  const updatedTask = await Task.findById(task._id);

  return res
  .status(200)
  .json(
    new ApiResponse("task updated", 200, updatedTask)
  )
})

export { createTask, getTaskById, changeTaskStatus };
