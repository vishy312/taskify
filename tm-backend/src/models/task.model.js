import mongoose, { Schema } from "mongoose";
import { priorityValues, statusValues } from "../constants.js";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required!"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: ""
    },
    duedate: Date,
    priority: {
      type: String,
      enum: priorityValues,
      required: true,
    },
    status: {
      type: String,
      enum: statusValues,
    },
    assigner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model("Task", taskSchema);
