import { Link, useLocation } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useTmAuth from "../../context/AuthProvider";

const LOGIN_URL = "/users/login";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(8)
})

type FormFields = z.infer<typeof schema>

function Login() {
  const {register, handleSubmit, setError, formState: {errors, isSubmitting}} = useForm<FormFields>({resolver: zodResolver(schema)});
  const navigate = useNavigate();
  const {setAuth}: any = useTmAuth();

  const location = useLocation();
  const from = location?.state?.from?.pathname || "/home"

  const onSubmit: SubmitHandler<FormFields> = async (data) =>{
    try {
      const response = await axios.post(LOGIN_URL, data, {
        headers: {'Content-Type' : "application/json"},
        withCredentials: true
      });
      setAuth({
        user: response.data.data.user,
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken
      })

      navigate(from, {replace: true})
    } catch (error) {
      setError("root", {message: "This username is already taken"})
    }
  }

  return (
    <div className="content flex justify-center items-center w-screen min-h-screen" style={{ backgroundColor: "#215ba8" }}>
      <div className="content flex justify-center items-center w-screen min-h-screen">

        <form onSubmit={handleSubmit(onSubmit)} className="content-card flex flex-col flex-initial gap-6 items-center w-1/4">
          <h1 className="display2">Login</h1>
          <div className="input-div">
            <input {...register("username")} type="text" id="username" placeholder="Username" />
            {errors.username && <p className="input-validation-msg">{errors.username.message}</p>}
          </div>
          <div className="input-div">
            <input {...register("password")} type="password" id="password" placeholder="Password" />
            {errors.password && <p className="input-validation-msg">{errors.password.message}</p>}
          </div>

          <button disabled={isSubmitting} className="auth-btn">{isSubmitting ? "Logging in": "Log in"}</button>
        {errors.root && <p className="input-validation-msg">{errors.root.message}</p>}
          <p className="body1">
            Don't have an account?{" "}
            <Link to={"/signup"}>
              <span className="body1span">Signup</span>
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}

export default Login;
