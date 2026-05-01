import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import authMiddleWare from "./auth.js";
import mongoose from "mongoose";
import Users from "./models/users.js";
import Waste from "./models/waste.js";

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

        const newUser = await Users.create({ username, password, role });

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

    const userExists = await Users.findOne({ username, password });

    if (!userExists) {
        res.status(403).json({
            message: "User doesn't exists",
        });
    }
    const role = userExists.role;
    const token = jwt.sign({ username, role }, process.env.JWTSECRET);
    res.json({
        token,
        message: "You have been successfully signed in!",
    });
});

app.get("/authenticatedRoute", authMiddleWare, (req, res) => {
    const username = req.username;
    const role = req.role;
    if (role !== "admin") {
        res.status(403).json({
            message: "You don't have permissions to access this route!",
        });
        return;
    }

    res.status(200).json({
        message: `Username: ${username}, you are in an authenticated route!`,
    });
});

app.listen(PORT, () => {
    console.log(`App listening on Port ${PORT}`);
});
