import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-5xl font-extrabold text-emerald-700 mb-6">
                Welcome to Fostride Smart Waste
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Track, manage, and optimize waste disposal efficiently. Whether
                you're a user reporting waste or an admin analyzing stats,
                Fostride makes it easy.
            </p>
            <div className="bg-white shadow-md rounded-lg p-6 mt-6 max-w-xl w-full text-left">
                <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
                    Demo Credentials
                </h2>

                <div className="mb-4">
                    <h3 className="font-semibold text-gray-800">Admin</h3>
                    <p className="text-gray-600">Username: Mihir Petkar</p>
                    <p className="text-gray-600">Password: Mihir123</p>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-800">User</h3>
                    <p className="text-gray-600">Username: Soham Kadam</p>
                    <p className="text-gray-600">Password: Soham123</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
