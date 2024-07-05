import { ObjectId } from "mongodb";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import mongoose from "mongoose";

const createProject = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError("Something went wrong", 401);
  }

  const { title, description, duedate, members } = req.body;

  if (title.trim() === "") {
    throw new ApiError("title must not be empty", 400);
  }
  if (!duedate) {
    throw new ApiError("duedate is required", 400);
  }

  if (!members && !Array.isArray(members)) {
    throw new ApiError("members is mandatory and it should be an array", 400);
  }

  const memberIds = members.map((member) => member._id);

  const membersToAdd = await User.find({ _id: { $in: memberIds } });

  if (membersToAdd.length !== members.length) {
    throw new ApiError("some or all of the members were invalid", 400);
  }

  const createdProject = await Project.create({
    title,
    description,
    duedate,
    members: membersToAdd,
    admins: [user],
  });

  if (!createdProject) {
    throw new ApiError("something went wrong while creating the project", 500);
  }

  return res
    .status(201)
    .json(
      new ApiResponse("project created successfully.", 201, createdProject)
    );
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  const projectToSend = await Project.aggregate([
    {
      $match: {
        _id: project._id,
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "project",
        as: "tasks",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "members",
      },
    },
  ]);

  if (!project) {
    throw new ApiError("Project was not found", 400);
  }

  return res
    .status(200)
    .json(
      new ApiResponse("Project fetched successfully", 200, projectToSend[0])
    );
});

const deleteProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  console.log(project);

  if (!project) {
    throw new ApiError("Project Id is invalid", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const deletedTasks = await Task.deleteMany({
      project: project._id,
    }).session(session);

    const deletedProject = await Project.findByIdAndDelete(project._id).session(
      session
    );
    await session.commitTransaction();
    session.endSession();

    return res
    .status(200)
    .json(
      new ApiResponse(
        "project and associated tasks deleted successfully",
        200,
        {
          projectDeleted: deletedProject.deletedCount,
          taskDeleted: deletedTasks.deletedCount,
        }
      )
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.
    status(500)
    .json(
      new ApiError("Something went wrong!", 500)
    )
  }
});
export { createProject, getProjectById, deleteProjectById };
