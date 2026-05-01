import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-emerald-600 text-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight">
                    Fostride Waste Dashboard
                </Link>
                <div className="space-x-4">
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="hover:text-emerald-200"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-white text-emerald-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <span className="font-medium text-emerald-100">
                                Hi, {user.username}
                            </span>
                            <Link
                                to={
                                    user.role === "admin"
                                        ? "/admin"
                                        : "/dashboard"
                                }
                                className="hover:text-emerald-200"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-800 transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
