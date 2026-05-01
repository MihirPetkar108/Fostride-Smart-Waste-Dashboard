import { useState } from "react";
import api from "../api/axios";

const AddWasteForm = ({ onWasteAdded }) => {
    const [wasteType, setWasteType] = useState("dry");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const res = await api.post("/user/waste", {
                wasteType,
                quantity: Number(quantity),
            });
            setMessage("Waste logged successfully!");
            setQuantity("");
            if (onWasteAdded) onWasteAdded(res.data.wasteData);
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage("Error adding waste data.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                Log New Waste
            </h3>
            {message && (
                <div
                    className={`p-2 mb-4 rounded ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                >
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-600 mb-1 font-medium">
                        Waste Type
                    </label>
                    <select
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={wasteType}
                        onChange={(e) => setWasteType(e.target.value)}
                    >
                        <option value="dry">Dry</option>
                        <option value="wet">Wet</option>
                        <option value="recyclable">Recyclable</option>
                        <option value="hazardous">Hazardous</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-600 mb-1 font-medium">
                        Quantity (kg or units approx)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                    Submit Entry
                </button>
            </form>
        </div>
    );
};

export default AddWasteForm;
