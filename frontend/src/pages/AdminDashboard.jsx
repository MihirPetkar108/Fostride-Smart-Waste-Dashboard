import { useEffect, useState } from "react";
import api from "../api/axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalEntries: 0,
        wasteDistribution: [],
        submissions: [],
    });
    const [users, setUsers] = useState([]);
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingUser, setLoadingUser] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [dashboardRes, usersRes] = await Promise.all([
                    api.get("/admin/dashboard"),
                    api.get("/admin/"),
                ]);
                setStats(dashboardRes.data);
                setUsers(usersRes.data.users || []);
            } catch (error) {
                console.error("Failed to load admin dashboard or users");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const handleUserClick = async (userId) => {
        setLoadingUser(true);
        try {
            const res = await api.get(`/admin/${userId}`);
            setSelectedUserData(res.data);
        } catch (err) {
            console.error("Failed to fetch user specific data");
        } finally {
            setLoadingUser(false);
        }
    };

    if (loading)
        return (
            <div className="text-center mt-20 text-emerald-600 text-xl">
                Loading Admin Dashboard...
            </div>
        );

    const chartData = {
        labels: stats.wasteDistribution.map((d) => d._id.toUpperCase()),
        datasets: [
            {
                data: stats.wasteDistribution.map((d) => d.total),
                backgroundColor: [
                    "#10B981",
                    "#3B82F6",
                    "#EF4444",
                    "#F59E0B",
                    "#6B7280",
                ],
                hoverBackgroundColor: [
                    "#059669",
                    "#2563EB",
                    "#DC2626",
                    "#D97706",
                    "#4B5563",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Aggregate Summary */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col justify-center items-center">
                    <h3 className="text-lg font-bold text-gray-600 mb-2">
                        Total Workspace Entries
                    </h3>
                    <div className="text-6xl font-extrabold text-emerald-600">
                        {stats.totalEntries}
                    </div>
                </div>

                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border border-gray-100 flex justify-center items-center h-80">
                    {stats.wasteDistribution.length > 0 ? (
                        <div className="w-full h-full flex flex-col items-center">
                            <h3 className="text-lg font-bold text-gray-600 mb-4">
                                Waste Distribution (Total Qty)
                            </h3>
                            <div className="h-64">
                                <Pie
                                    data={chartData}
                                    options={{ maintainAspectRatio: false }}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No waste data to chart.</p>
                    )}
                </div>
            </div>

            {/* Individual Users Section */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 mt-8 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Individual User Data
                </h3>
                <div className="flex flex-wrap gap-3 mb-6">
                    {users.length === 0 && (
                        <p className="text-gray-500">
                            No individual users found.
                        </p>
                    )}
                    {users.map((u) => (
                        <button
                            key={u._id}
                            onClick={() => handleUserClick(u._id)}
                            className="px-4 py-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg font-semibold transition"
                        >
                            {u.username}
                        </button>
                    ))}
                </div>

                {loadingUser && (
                    <div className="text-emerald-600 font-medium">
                        Loading user details...
                    </div>
                )}

                {!loadingUser && selectedUserData && (
                    <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-2xl font-bold text-gray-800">
                                {selectedUserData.username}'s Profile
                            </h4>
                            <button
                                onClick={() => setSelectedUserData(null)}
                                className="text-sm px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition"
                            >
                                Close Details
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="grid grid-cols-2 gap-4 h-max">
                                <div className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                                    <span className="text-gray-500 font-medium text-sm text-center">
                                        Total Entries
                                    </span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                        {selectedUserData.totalEntries}
                                    </span>
                                </div>
                                {selectedUserData.wasteDistribution.map((w) => (
                                    <div
                                        key={w._id}
                                        className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col items-center justify-center"
                                    >
                                        <span className="text-gray-500 font-medium text-sm capitalize">
                                            {w._id}
                                        </span>
                                        <span className="text-xl font-bold text-gray-800">
                                            {w.total}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col items-center justify-center h-64">
                                {selectedUserData.wasteDistribution.length >
                                0 ? (
                                    <div className="h-full w-full">
                                        <Pie
                                            data={{
                                                labels: selectedUserData.wasteDistribution.map(
                                                    (d) => d._id.toUpperCase(),
                                                ),
                                                datasets: [
                                                    {
                                                        data: selectedUserData.wasteDistribution.map(
                                                            (d) => d.total,
                                                        ),
                                                        backgroundColor: [
                                                            "#10B981",
                                                            "#3B82F6",
                                                            "#EF4444",
                                                            "#F59E0B",
                                                            "#6B7280",
                                                        ],
                                                        hoverBackgroundColor: [
                                                            "#059669",
                                                            "#2563EB",
                                                            "#DC2626",
                                                            "#D97706",
                                                            "#4B5563",
                                                        ],
                                                        borderWidth: 1,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                maintainAspectRatio: false,
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-500">
                                        No waste data to chart.
                                    </p>
                                )}
                            </div>
                        </div>

                        <h5 className="font-bold text-gray-700 mb-3">
                            Submission History
                        </h5>
                        {selectedUserData.totalSubmissions.length === 0 ? (
                            <p className="text-gray-500 py-2">
                                No submissions from this user yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse bg-white shadow-sm rounded">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-600 border-b">
                                            <th className="py-2 px-4 text-sm font-semibold">
                                                Date
                                            </th>
                                            <th className="py-2 px-4 text-sm font-semibold">
                                                Type
                                            </th>
                                            <th className="py-2 px-4 text-sm font-semibold">
                                                Quantity
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedUserData.totalSubmissions.map(
                                            (entry) => (
                                                <tr
                                                    key={entry._id}
                                                    className="border-b hover:bg-gray-50 transition"
                                                >
                                                    <td className="py-2 px-4 text-sm text-gray-600">
                                                        {new Date(
                                                            entry.date,
                                                        ).toLocaleString()}
                                                    </td>
                                                    <td className="py-2 px-4 text-sm capitalize">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs ${entry.wasteType === "hazardous" ? "bg-red-100 text-red-600" : entry.wasteType === "recyclable" ? "bg-blue-100 text-blue-600" : entry.wasteType === "wet" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                                                        >
                                                            {entry.wasteType}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-4 text-sm font-bold text-gray-800">
                                                        {entry.quantity} units
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Submissions List */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Users Activity Log
                </h3>
                {stats.submissions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        No submissions found across the system.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 border-b">
                                    <th className="py-3 px-4">User</th>
                                    <th className="py-3 px-4">Type</th>
                                    <th className="py-3 px-4">Quantity</th>
                                    <th className="py-3 px-4">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.submissions.map((entry) => (
                                    <tr
                                        key={entry._id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3 px-4 font-semibold text-emerald-700">
                                            {entry.user?.username ||
                                                "Unknown User"}
                                        </td>
                                        <td className="py-3 px-4 capitalize">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${entry.wasteType === "hazardous" ? "bg-red-100 text-red-600" : entry.wasteType === "recyclable" ? "bg-blue-100 text-blue-600" : entry.wasteType === "wet" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                                            >
                                                {entry.wasteType}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-800">
                                            {entry.quantity}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {new Date(
                                                entry.date,
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
