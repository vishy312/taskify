import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "../../models/user.model";
import Select, { StylesConfig } from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const GET_USERS_ENDPOINT = "/users/get-all";
const CREATE_PROJECT_ENDPOINT = "/projects/create-project";

const createProjectFormSchema = z.object({
  title: z.string().trim().min(1, { message: "title is required" }),
  description: z.string(),
  duedate: z.string().date().min(1, { message: "duedate is required" }),
  members: z.array(
    z.object({
      _id: z.string(),
    })
  ),
});

type createProjectFormValues = z.infer<typeof createProjectFormSchema>;

const selectStyles: StylesConfig = {
  valueContainer: (styles) => ({ ...styles, paddingBlock: "1em" }),
};

function CreateProject() {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<createProjectFormValues>({
    resolver: zodResolver(createProjectFormSchema),
  });

  const [users, setUsers] = useState<any[]>([]);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const handleOnChange = (event: any) => {
    const userValues = event.map((user: any) => {
      return { _id: user.value };
    });
    setValue("members", userValues);
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
      } catch (error) {}
    })();
  }, []);

  const onFormSubmit: SubmitHandler<createProjectFormValues> = async (data) => {
    try {
      const response = await axiosPrivate.post(CREATE_PROJECT_ENDPOINT, data);
      console.log(response);
      navigate("/home");
    } catch (error) {
      setError("root", {
        message: "Something went wrong while submitting the form",
      });
    }
  };
  return (
    <div className="project-form flex justify-center items-center min-h-screen">
      <form
        className="w-1/2 flex flex-col gap-2 items-center"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <h1 className="display1 text-center mb-8">Create Project</h1>
        <div className="input-div">
          <input
            {...register("title")}
            type="text"
            id="title"
            placeholder="Project Title"
          />
          {errors.title && (
            <p className="input-validation-msg">{errors.title?.message}</p>
          )}
        </div>
        <div className="input-div">
          <input
            {...register("description")}
            type="text"
            id="title"
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
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Project Members"
            options={users}
            onChange={handleOnChange}
            styles={selectStyles}
          />
          {errors.members && <p className="input-validation-msg">{errors.members?.message}</p>}
        </div>
        <div className="input-div">
          <input
            {...register("duedate")}
            type="date"
            id="title"
            placeholder="Duedate"
          />
          {errors.duedate && (
            <p className="input-validation-msg">{errors.duedate?.message}</p>
          )}
        </div>

        <button className="auth-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
        {errors.root && (
          <p className="input-validation-msg">{errors.root.message}</p>
        )}
      </form>
    </div>
  );
}

export default CreateProject;
