import { useNavigate } from "react-router";
import { MdOutlineLibraryBooks } from "react-icons/md";
import axios from "axios";
import React, { useState } from "react";
import Loading from "../components/Loading";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!acceptPolicy) newErrors.acceptPolicy = "You must accept the Privacy Policy";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/user/signup", {
        username,
        email,
        password
      });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Signup failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading text="Signing up..." />}
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4">
        <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-800 p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-2xl">
                <MdOutlineLibraryBooks className="text-black" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Smart Notes</h2>
            <p className="text-gray-400 text-sm mt-1">Your intelligent note-taking companion</p>
          </div>

          <h3 className="text-lg font-semibold mb-1">Create account</h3>
          <p className="text-gray-400 text-sm mb-6">Sign up to start taking smart notes</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="text-sm text-gray-400">Username</label>
              <input
                type="text"
                placeholder="your_username"
                className="w-full mt-1 p-3 bg-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 p-3 bg-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-400">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 p-3 bg-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Privacy Policy */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={acceptPolicy}
                onChange={(e) => setAcceptPolicy(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
              <label className="text-sm text-gray-400">
                I accept the{" "}
                <a href="/privacy" className="text-blue-400 underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.acceptPolicy && <p className="text-red-500 text-sm mt-1">{errors.acceptPolicy}</p>}

            {/* General Error */}
            {errors.general && <p className="text-red-500 text-sm mt-1 font-medium">{errors.general}</p>}

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 rounded-lg font-semibold transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <button
              onClick={(e) => { e.preventDefault(); navigate("/login"); }}
              className="text-blue-400 hover:underline"
            >
              Sign In
            </button>
          </p>

          <p className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
}
