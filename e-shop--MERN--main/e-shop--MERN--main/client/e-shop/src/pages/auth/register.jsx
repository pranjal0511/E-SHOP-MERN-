import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../store/auth-slice";


import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  userName: z.string().min(4, "userName must be at least 4 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password :  z.string().min(4, "Password must be at least 4 characters long"),
});

const AuthRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    // setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });


  const onSubmit = async (formData) => {
    
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/auth/login");
      } else {
        toast.error(data?.payload?.message); 
      }
    });
  };
  

  return (
    <div className="flex items-center max-w-screen justify-center">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create New Account</h2>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>

        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700">userName</label>
            <input
              {...register("userName")}
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter your name"
            />
            {errors.userName&& <p className="text-red-500 text-sm">{errors.userName.message}</p>}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700">email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>


           {/* Role Field */}
           <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              {...register("password")}
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            {"Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthRegister;
