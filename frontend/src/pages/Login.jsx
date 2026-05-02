import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            console.log(import.meta.env.VITE_API_URL);
            const res = await api.post("/authentication/signin", formData);
            login(res.data.token);
            navigate("/"); // The ProtectedRoute inside App will redirect appropriately, or we can decode and push
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Wrong credentials. Please try again.",
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-emerald-700 mb-6">
                    Log In
                </h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    username: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition"
                    >
                        Login
                    </button>
                    <p className="text-center text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-emerald-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
