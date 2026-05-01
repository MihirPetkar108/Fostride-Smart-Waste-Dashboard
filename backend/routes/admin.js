import express from "express";
import Users from "../models/users.js";
import Waste from "../models/waste.js";
import mongoose, { mongo } from "mongoose";

const router = express.Router();

// Get data for all users
router.get("/", async (req, res) => {
    const username = req.username;
    const role = req.role;

    const users = await Users.find({ role: "user" }, "_id username");
    res.status(200).json({
        users,
    });
});

// Get admin dashboard
router.get("/dashboard", async (req, res) => {
    const totalEntries = await Waste.countDocuments();

    const wasteDistribution = await Waste.aggregate([
        {
            $group: {
                _id: "$wasteType",
                total: { $sum: "$quantity" },
            },
        },
    ]);

    const submissions = await Waste.find().populate("user", "username");

    res.status(200).json({
        totalEntries,
        wasteDistribution,
        submissions,
    });
});

// Get waste data for a particular user
router.get("/:userId", async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const user = await Users.findById(userId, "username");

    const totalEntries = await Waste.countDocuments({ user: userId });
    const wasteDistribution = await Waste.aggregate([
        {
            $match: { user: userId },
        },
        {
            $group: {
                _id: "$wasteType",
                total: { $sum: "$quantity" },
            },
        },
    ]);

    const totalSubmissions = await Waste.find({
        user: userId,
    });

    res.status(200).json({
        username: user?.username,
        totalEntries,
        wasteDistribution,
        totalSubmissions,
    });
});

export default router;
