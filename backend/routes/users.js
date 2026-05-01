import express from "express";
import Users from "../models/users.js";
import Waste from "../models/waste.js";

const router = express.Router();

// Add waste data for a user
router.post("/waste", async (req, res) => {
    const username = req.username;
    const role = req.role;

    const user = await Users.findOne({ username });
    const { wasteType, quantity } = req.body;

    const newWasteData = await Waste.create({
        user: user._id,
        wasteType,
        quantity,
    });

    res.status(200).json({
        message: "Waste data added successfully!",
        wasteData: newWasteData,
    });
});

// Get user dashboard
router.get("/dashboard", async (req, res) => {
    const username = req.username;
    const role = req.role;

    const user = await Users.findOne({ username });
    const totalEntries = await Waste.countDocuments({ user: user._id });
    const wasteDistribution = await Waste.aggregate([
        {
            $match: { user: user._id },
        },
        {
            $group: {
                _id: "$wasteType",
                total: { $sum: "$quantity" },
            },
        },
    ]);

    const totalSubmissions = await Waste.find({ user: user._id });

    res.status(200).json({
        totalEntries,
        wasteDistribution,
        totalSubmissions,
    });
});

export default router;
