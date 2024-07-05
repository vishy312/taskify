import { Task } from "./task.model";
import { User } from "./user.model";

export interface Project{
    _id: string;
    title: string;
    description: string;
    duedate: Date;
    admins: User[];
    members: User[];
    tasks?: Task[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}
