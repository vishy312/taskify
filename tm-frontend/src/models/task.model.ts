import { User } from "./user.model";

export interface Task {
  title: string;
  description: string;
  duedate: Date;
  priority: "High" | "Medium" | "Low";
  status: "Todo" | "In-progress" | "Completed";
  assigner: User;
  assignedTo: User;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
