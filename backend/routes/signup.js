import express from "express";
import Users from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";

const router = express.Router();

router.get("/signup", (_req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/signup.html"));
});

router.post("/signup", async (req, res) => {
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

export default router;
