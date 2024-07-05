import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { StylesConfig } from "react-select";
import { z } from "zod";
import { User } from "../../models/user.model";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const GET_USERS_ENDPOINT = "/users/get-all";
const CREATE_TASK_ENDPOINT = "/tasks/create";

const createTaskFormSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim(),
  duedate: z.string().date().min(1),
  priority: z.enum(["High", "Medium", "Low"]),
  assignedTo: z.object({
    _id: z.string(),
  }),
  project: z.object({
    _id: z.string(),
  }).optional()
});

type createTaskFormValues = z.infer<typeof createTaskFormSchema>;

const selectStyles: StylesConfig = {
  valueContainer: (styles) => ({ ...styles, paddingBlock: "1em" }),
};

const priorityOptions = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];
function CreateTask() {
  let { state } = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<createTaskFormValues>({
    resolver: zodResolver(createTaskFormSchema),
  });
  const [users, setUsers] = useState<User[]>([]);
  const onFormSubmit: SubmitHandler<createTaskFormValues> = async (data) => {
      
      try {
        const response = axiosPrivate.post(CREATE_TASK_ENDPOINT, data);
        console.log(response);   
        navigate("/home")
    } catch (error) {
      setError("root", {
        message: "Something went wrong while submitting the form",
      });
    }
  };

  const handleOnChange = (event: any) => {
    const user = {
      _id: event.value,
    };

    setValue("assignedTo", user);
  };
  const handleOnPriorityChange = (event: any) => {
    setValue("priority", event.value);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosPrivate.get(GET_USERS_ENDPOINT);

        const allUsers = response.data.data.map((user: User) => {
          return {
            value: user._id,
            label: user.username,
          };
        });
        setUsers(allUsers);
        setValue("project", {_id: state.projectId});
      } catch (error) {}
    })();
  }, []);
  return (
    <div className="task-form flex flex-col justify-center items-center min-h-screen">
      <form
        className="w-1/2 flex flex-col gap-2 items-center"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <h1 className="display1 text-center mb-8">Create Task</h1>
        <div className="input-div">
          <input
            {...register("title")}
            type="text"
            id="title"
            placeholder="Task Title"
          />
          {errors.title && (
            <p className="input-validation-msg">{errors.title?.message}</p>
          )}
        </div>
        <div className="input-div">
          <input
            {...register("description")}
            type="text"
            id="description"
            placeholder="Description"
          />
          {errors.description && (
            <p className="input-validation-msg">
              {errors.description?.message}
            </p>
          )}
        </div>
        <div className="input-div">
          <Select
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Assign to"
            options={users}
            onChange={handleOnChange}
            styles={selectStyles}
          />
          {errors.assignedTo && (
            <p className="input-validation-msg">{errors.assignedTo?.message}</p>
          )}
        </div>
        <div className="input-div">
          <Select
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Priority"
            options={priorityOptions}
            onChange={handleOnPriorityChange}
            styles={selectStyles}
          />
          {errors.priority && (
            <p className="input-validation-msg">{errors.priority?.message}</p>
          )}
        </div>
        <div className="input-div">
          <input
            {...register("duedate")}
            type="date"
            id="duedate"
            placeholder="Duedate"
          />
          {errors.duedate && (
            <p className="input-validation-msg">{errors.duedate?.message}</p>
          )}
        </div>

        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
        {errors.root && (
          <p className="input-validation-msg">{errors.root.message}</p>
        )}
      </form>
    </div>
  );
}

export default CreateTask;
