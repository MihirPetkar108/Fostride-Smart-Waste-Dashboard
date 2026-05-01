import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { adminAuth, userAuth, authMiddleWare } from "./auth/auth.js";
import mongoose from "mongoose";
import Users from "./models/users.js";
import Waste from "./models/waste.js";
import bcrypt from "bcrypt";

dotenv.config();

const URI = `mongodb+srv://mihirpetkar2006_db_user:${process.env.DBPASSWORD}@cluster0.lnicn3r.mongodb.net/fostride`;
mongoose.connect(URI).then(() => console.log("Connected to DB!"));

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
    res.send("Hello, World!");
});

app.get("/signup", (_req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/signup.html"));
});

app.post("/signup", async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const userExists = await Users.findOne({ username });

        if (userExists) {
            res.status(409).json({
                message: "User with that username already exists.",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({
            username,
            password: hashedPassword,
            role,
        });

        res.status(200).json({
            message: "You have signed up!",
            user: newUser,
        });
    } catch (e) {
        res.status(500).json({
            message: `Couldn't save user in DB. Error: ${e}`,
        });
        return;
    }
});

app.get("/signin", (_req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/signin.html"));
});

app.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    const userExists = await Users.findOne({ username });

    if (!userExists) {
        res.status(403).json({
            message: "User doesn't exists",
        });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, userExists.password);

    if (!isPasswordValid) {
        res.status(403).json({
            message: "Invalid password",
        });
        return;
    }
    const role = userExists.role;
    const token = jwt.sign({ username, role }, process.env.JWTSECRET);
    res.json({
        token,
        message: "You have been successfully signed in!",
    });
});

app.get("/authenticatedRoute", authMiddleWare, adminAuth, (req, res) => {
    const username = req.username;
    const role = req.role;

    res.status(200).json({
        message: `Username: ${username}, you are in an authenticated route!`,
    });
});

// ------------ USER ROUTES ------------

// Get waste data for a user
app.get("/user/waste", authMiddleWare, userAuth, async (req, res) => {
    const username = req.username;
    const role = req.role;

    const user = await Users.findOne({ username });
    const wasteData = await Waste.find({ user: user._id });
    res.status(200).json({
        wasteData,
    });
});

// Add waste data for a user
app.post("/user/waste", authMiddleWare, userAuth, async (req, res) => {
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
app.get("/user/dashboard", authMiddleWare, userAuth, async (req, res) => {
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

// ------------ ADMIN ROUTES ------------

// Get data for all users
app.get("/admin", authMiddleWare, adminAuth, async (req, res) => {
    const username = req.username;
    const role = req.role;

    const users = await Users.find({ role: "user" }, "_id username");
    res.status(200).json({
        users,
    });
});

// Get admin dashboard
app.get("/admin/dashboard", authMiddleWare, adminAuth, async (req, res) => {
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
app.get("/admin/:userId", authMiddleWare, adminAuth, async (req, res) => {
    const username = req.username;
    const role = req.role;
    const userId = req.params.userId;

    const wasteData = await Waste.find({ user: userId }).populate(
        "user",
        "username",
    );

    res.status(200).json({
        wasteData: wasteData,
    });
});

app.listen(PORT, () => {
    console.log(`App listening on Port ${PORT}`);
});
