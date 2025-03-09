import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginUser } from "../../store/auth-slice";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    console.log("formData", formData);
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        console.log("data?.payload?.success", data?.payload?.success);
        navigate("/shop/home");
      } else {
        console.log("title: data?.payload?.message,", data?.payload?.message);
      }
    });
  };

  return (
    <div className="flex items-center max-w-screen justify-center">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign in to your account</h2>
        <p className="text-sm text-center text-gray-600">
          Do not have an account?{" "}
          <a href="/auth/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>

        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthLogin;
