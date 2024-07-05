import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
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
    duedate: {
        type: Date,
        required: [true, "duedate is required"]
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ]
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model("Project", projectSchema);
