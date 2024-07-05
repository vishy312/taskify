import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/view.scss";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Home from "./components/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProject from "./components/create-project/CreateProject";
import CreateTask from "./components/create-task/CreateTask";
import { AuthProvider } from "./context/AuthProvider";
import TaskTab from "./components/task-tab/TaskTab";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/login"} replace />,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/home",
    element: (
        <Home />
    ),
    children: [
      {
        path: "",
        Component: Dashboard,
      },
      {
        path: "/home/create-project",
        Component: CreateProject,
      },
      {
        path: "/home/create-task",
        Component: CreateTask,
      },
      {
        path: "/home/task/:taskId",
        Component: TaskTab
      }
    ],
  },
  
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
