import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/userContext";

const Signup = () => {
  const navigate = useNavigate();
  //contexts
  const { serverUrl } = useContext(authDataContext);
const{userData,setUserData}=useContext(UserDataContext)
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //1-use state se data
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //2 handle input
  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
const res=
      await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      navigate("/");
      setUserData(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-400 blur-3xl opacity-60 rounded-full -z-10" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 blur-3xl opacity-60 rounded-full -z-10" />

      {/* Card */}
      <div className="bg-white/90 backdrop-blur-lg w-full max-w-lg rounded-2xl shadow-2xl border">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-8 pb-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Join our community today!
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              className={inputClass}
              value={formData.firstname}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              className={inputClass}
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            className={inputClass}
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className={inputClass}
            value={formData.email}
            onChange={handleChange}
            required
          />

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className={inputClass}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>

          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <div className="flex-1 border-t" />
            Or sign up with
            <div className="flex-1 border-t" />
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" className="border py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 cursor-pointer">
              <FcGoogle size={20} /> Google
            </button>
            <button type="button" className="border py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 cursor-pointer">
              <FaGithub size={20} /> GitHub
            </button>
          </div> */}
        </form>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-indigo-600 font-bold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
