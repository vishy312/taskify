import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../../api/axios";

const schema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  fullname: z.string().min(1),
  password: z.string().min(1)
})

const SIGNUP_URL = "/users/registerUser"

type FormFields = z.infer<typeof schema>

function Signup() {
  const navigate = useNavigate();
  
  const {register, handleSubmit, setError, formState: {errors, isSubmitting}} = useForm<FormFields>({resolver: zodResolver(schema)});
  const onSubmit: SubmitHandler<FormFields> = async (data)=>{
    try {
      await axios.post(SIGNUP_URL, data, {
        headers: {'Content-Type' : "application/json"}
      });

      navigate("/login")
    } catch (error) {
      setError("root", {message: "Something was not right"})
    }
  }

  return (
    <div className="content flex justify-center items-center w-screen min-h-screen" style={{backgroundColor: '#215ba8'}}>
      <form onSubmit={handleSubmit(onSubmit)} className="content-card flex flex-col flex-initial gap-6 items-center w-1/4">
        <h1 className="display2">Signup</h1>
        <div className="input-div">
          <input {...register("username")} type="text" id="username" placeholder="Username" />
          {errors.username && <p className="input-validation-msg">{errors.username.message}</p>}
        </div>
        <div className="input-div">
          <input {...register("email")} type="email" id="email" placeholder="Email" />
          {errors.email && <p className="input-validation-msg">{errors.email.message}</p>}
        </div>
        <div className="input-div">
          <input {...register("fullname")} type="text" id="fullname" placeholder="Fullname" />
          {errors.fullname && <p className="input-validation-msg">{errors.fullname.message}</p>}
        </div>
        <div className="input-div">
          <input {...register("password")} type="password" id="password" placeholder="Password" />
          {errors.password && <p className="input-validation-msg">{errors.password.message}</p>}
        </div>

        <button disabled={isSubmitting} className="auth-btn">{isSubmitting ? "Signing up": "Sign up"}</button>
          {errors.root && <p className="input-validation-msg">{errors.root.message}</p>}
        <p className="body1">
          Already have an account? <Link to={"/login"}><span className="body1span">Login</span></Link>
        </p>
      </form>
    </div>
  )
}

export default Signup