import { useNavigate } from "react-router";
import { MdOutlineLibraryBooks } from "react-icons/md";
import axios from "axios";
import { useState } from "react";
import Loading from "../components/Loading";


export default function Login() {

    // const token = localStorage.getItem("accessToken");

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     if (token) {
    //         navigate("/");
    //     }
    // }, [navigate, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
                email,
                password
            });
            localStorage.setItem("accessToken", response.data.data.accessToken);

            navigate("/");
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {loading && <Loading text="Signing in..." />}
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4">
                <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-800 p-8">
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-2xl">
                                <MdOutlineLibraryBooks className="text-black" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold">Smart Notes</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Your intelligent note-taking companion
                        </p>
                    </div>

                    <h3 className="text-lg font-semibold mb-1">Welcome back</h3>
                    <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm text-gray-400">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                className="w-full mt-1 p-3 bg-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                className="w-full mt-1 p-3 bg-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 rounded-lg font-semibold transition"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don’t have an account?{" "}
                        <button onClick={(e) => { e.preventDefault(); navigate("/signup") }} className="text-blue-400 hover:underline">
                            Sign Up
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
