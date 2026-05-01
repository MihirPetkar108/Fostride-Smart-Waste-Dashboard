import express from "express";
import Users from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";

const router = express.Router();

router.get("/signin", (_req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/signin.html"));
});

router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const userExists = await Users.findOne({ username });

        if (!userExists) {
            res.status(403).json({
                message: "User doesn't exists",
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            userExists.password,
        );

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
    } catch (e) {
        res.status(500).json({
            message: `Error signing in. Error: ${e}`,
        });
        return;
    }
});

export default router;
