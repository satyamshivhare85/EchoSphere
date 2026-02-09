import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/userContext";

const Login = () => {
  const navigate = useNavigate();
  //contexts
  const { serverUrl } = useContext(authDataContext);
   const {userData,setUserData}=useContext(UserDataContext)
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //1- form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 2-handle input
  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //3- submit login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
const res=
      await axios.post(
        `${serverUrl}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      setUserData(res.data)
       navigate("/");
       console.log("Login success:", res.data);
      setEmail("");
      setPassword("");

      // dashboard / home
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 " +
    "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 " +
    "focus:bg-white outline-none transition-all cursor-text";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gray-100">

      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-400 blur-3xl opacity-60 rounded-full -z-10"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 blur-3xl opacity-60 rounded-full -z-10"></div>

      {/* Card */}
      <div className="bg-white/90 backdrop-blur-lg w-full max-w-md rounded-2xl shadow-2xl border">

        {/* Header */}
        <div className="px-6 sm:px-8 pt-8 pb-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Log in to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 sm:mx-8 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-8 space-y-4">

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className={inputClass}
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={`${inputClass} pr-10`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              👁
            </button>
          </div>

          {/* Forgot password */}
          <p className="text-sm text-indigo-600 text-right cursor-pointer hover:underline">
            Forgot password?
          </p>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Logging in..." : "Log In →"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <div className="flex-1 border-t"></div>
            Or sign in with
            <div className="flex-1 border-t"></div>
          </div>

          {/* Social */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              className="border py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 cursor-pointer"
            >
              <FcGoogle size={20} /> Google
            </button>
            <button
              type="button"
              className="border py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 cursor-pointer"
            >
              <FaGithub size={20} /> GitHub
            </button>
          </div> */}
        </form>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t text-center text-sm">
          Don&apos;t have an account?{" "}
          <span
            className="text-indigo-600 font-bold cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
