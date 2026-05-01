import { useEffect, useState } from "react";
import api from "../api/axios";
import AddWasteForm from "../components/AddWasteForm";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
    const [stats, setStats] = useState({
        totalEntries: 0,
        wasteDistribution: [],
        totalSubmissions: [],
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const res = await api.get("/user/dashboard");
            setStats(res.data);
        } catch (error) {
            console.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleWasteAdded = () => {
        fetchDashboard(); // Refresh data
    };

    if (loading)
        return (
            <div className="text-center mt-20 text-gray-600 text-xl text-emerald-600">
                Loading Dashboard...
            </div>
        );

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                Personal Waste Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add Entry Section */}
                <div className="col-span-1">
                    <AddWasteForm onWasteAdded={handleWasteAdded} />
                </div>

                {/* Stats & History Section */}
                <div className="col-span-1 md:col-span-2 space-y-8">
                    {/* Stat Cards & Graph */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="grid grid-cols-2 gap-4 h-max">
                            <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center text-center">
                                <span className="text-gray-500 font-medium">
                                    Total Entries
                                </span>
                                <span className="text-3xl font-bold text-emerald-600">
                                    {stats.totalEntries}
                                </span>
                            </div>
                            {stats.wasteDistribution.map((w) => (
                                <div
                                    key={w._id}
                                    className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center text-center"
                                >
                                    <span className="text-gray-500 font-medium capitalize">
                                        {w._id}
                                    </span>
                                    <span className="text-2xl font-bold text-gray-800">
                                        {w.total}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Chart Section */}
                        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col items-center justify-center min-h-[16rem]">
                            {stats.wasteDistribution.length > 0 ? (
                                <div className="h-48 w-full">
                                    <Pie
                                        data={{
                                            labels: stats.wasteDistribution.map(
                                                (d) => d._id.toUpperCase(),
                                            ),
                                            datasets: [
                                                {
                                                    data: stats.wasteDistribution.map(
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
                                        options={{ maintainAspectRatio: false }}
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    No waste data to chart.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Submission History
                        </h3>
                        {stats.totalSubmissions.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                No submissions yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 border-b">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Type</th>
                                            <th className="py-3 px-4">
                                                Quantity
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.totalSubmissions.map((entry) => (
                                            <tr
                                                key={entry._id}
                                                className="border-b hover:bg-gray-50 transition"
                                            >
                                                <td className="py-3 px-4 text-gray-600">
                                                    {new Date(
                                                        entry.date,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="py-3 px-4 font-medium capitalize whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs ${entry.wasteType === "hazardous" ? "bg-red-100 text-red-600" : entry.wasteType === "recyclable" ? "bg-blue-100 text-blue-600" : entry.wasteType === "wet" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                                                    >
                                                        {entry.wasteType}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-800 font-semibold">
                                                    {entry.quantity} units/kg
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
