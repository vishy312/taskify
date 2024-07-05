import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Popover from "@mui/material/Popover";
import React, { useEffect, useState } from "react";
import UserCad from "../user-card/UserCard";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Project } from "../../models/project.model";
import { Task } from "../../models/task.model";
import TaskCard from "../task/TaskCard";

const GET_DETAILS_ENDPOINT = "/users/get-details";
const GET_OPENED_PROJECT = "/projects/";
const DELETE_PROJECT_URL = "/projects/";

function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openedProject, setOpenedProject] = useState<Project | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const transformDateFormat = (date: Date) => {
    const dateObj = new Date(date);
    return (
      dateObj.getDate() + "/" + dateObj.getMonth() + "/" + dateObj.getFullYear()
    );
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState(false);

  const handleDeleteProject = () => {
    setOpenDeleteAlertDialog(true);
  };

  const navigate = useNavigate()
  const handleDialogClose = async (
    projectId: string,
    dialogAction: boolean
  ) => {
    console.log(dialogAction);
    console.log(projectId);

    if (dialogAction) {
      try {
        const response = await axiosPrivate.delete(
          DELETE_PROJECT_URL + projectId
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
    setOpenDeleteAlertDialog(false);
    navigate(0)
  };

  useEffect(() => {
    (async () => {
      try {
        setError(false);
        setLoading(true);

        const response = await axiosPrivate.get(GET_DETAILS_ENDPOINT);
        setProjects(response.data?.data[0]?.projects);
        setTasks(response.data?.data[0]?.pendingTasks);

        setLoading(true);
      } catch (err) {
        setError(true);
      }
    })();
  }, [error, loading]);

  const openProject = async (index: number) => {
    try {
      const response = await axiosPrivate.get(
        GET_OPENED_PROJECT + projects[index]._id
      );
      setOpenedProject(response.data.data);
    } catch (error) {
      console.error(error);
      
    }
  };

  return (
    <div className="dashboard min-h-screen flex">
      <div className="projects w-1/4 bg-[#a6bddc] flex flex-col items-center gap-2 py-4">
        <Link to={"/home/create-project"}>
          <Tooltip title="Add New Project" placement="right">
            <Fab color="primary" aria-label="add">
              +
            </Fab>
          </Tooltip>
        </Link>
        {loading &&
          projects?.map((project, index) => {
            return (
              <div
                key={index}
                className="project bg-white grid grid-cols-2 w-11/12 rounded p-4 justify-between cursor-pointer"
                onClick={() => {
                  openProject(index);
                }}
              >
                <p className="title">{project?.title}</p>
                <div className="duedate body2 flex items-center justify-end gap-1">
                  {transformDateFormat(project?.duedate)}
                  <span
                    onClick={handleDeleteProject}
                    className="material-symbols-outlined cursor-pointer"
                  >
                    delete
                  </span>
                  <Dialog
                    open={openDeleteAlertDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Delete This?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Do you really want to delete {project.title}?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          handleDialogClose(project._id, true);
                        }}
                      >
                        Yes
                      </Button>
                      <Button
                        onClick={() => {
                          handleDialogClose(project._id, false);
                        }}
                        autoFocus
                      >
                        No
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
                <p className="caption col-span-2">{project?.description}</p>
              </div>
            );
          })}
      </div>

      <div className="project-tasks w-1/2 p-4">
        {openedProject && (
          <div className="project-tile">
            <h1 className="display1 text-center my-4">
              {openedProject.title} -{" "}
              <span className="subheading2">
                ({transformDateFormat(openedProject.duedate)})
              </span>
            </h1>
            <div className="description flex justify-between w-11/12">
              <p className="subheading2">{openedProject.description}</p>
              <Link
                to={"/home/create-task"}
                state={{ projectId: openedProject._id }}
              >
                <Tooltip title="Add New Task">
                  <Fab color="primary" aria-label="add" className="self-end">
                    +
                  </Fab>
                </Tooltip>
              </Link>
            </div>
            <div className="project-body">
              <div className="body-detail flex mt-10">
                <div className="tasks w-3/4">
                  <h3
                    className="subheading1 text-center py-2 border-r-2"
                    style={{ backgroundColor: "#c8c8c8" }}
                  >
                    Project Tasks
                  </h3>
                  {openedProject?.tasks?.map((task, index) => {
                    return (
                      <Link to={"/home/task/" + task._id}>
                        <TaskCard
                          key={index}
                          title={task.title}
                          duedate={transformDateFormat(task.duedate)}
                          description={task.description}
                          status={task.status}
                        />
                      </Link>
                    );
                  })}
                </div>
                <div className="members w-1/4">
                  <h3
                    className="subheading1 py-2 text-white text-center"
                    style={{ backgroundColor: "#c8c8c8" }}
                  >
                    Project Team
                  </h3>
                  {openedProject.members.map((member, index) => {
                    return (
                      <div key={index}>
                        <div
                          className="member subheading2 p-4 cursor-pointer"
                          aria-owns={open ? "mouse-over-popover" : undefined}
                          aria-haspopup="true"
                          onMouseEnter={handlePopoverOpen}
                          onMouseLeave={handlePopoverClose}
                        >
                          <p className="text-center">{member.fullname}</p>
                        </div>
                        <Popover
                          id="mouse-over-popover"
                          sx={{
                            pointerEvents: "none",
                          }}
                          open={open}
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          onClose={handlePopoverClose}
                          disableRestoreFocus
                        >
                          <UserCad user={member} />
                        </Popover>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pending-tasks w-1/4 border-l-2 border-[#215ba8] flex flex-col">
        <h3
          className="subheading1 py-2 text-center"
          style={{ backgroundColor: "#c8c8c8" }}
        >
          My Pending Tasks
        </h3>
        {tasks?.map((task, index) => {
          return (
            <Link to={"/home/task/" + task._id}>
              <TaskCard
                key={index}
                title={task.title}
                duedate={transformDateFormat(task.duedate)}
                description={task.description}
                status={task.status}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
