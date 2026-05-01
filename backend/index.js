import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { adminAuth, userAuth, authMiddleWare } from "./auth/auth.js";
import mongoose from "mongoose";

import signupRouter from "./routes/signup.js";
import signinRouter from "./routes/signin.js";
import userRouter from "./routes/users.js";
import adminRouter from "./routes/admin.js";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

// ------------- User authentication routes -------------
app.use("/authentication", signupRouter);
app.use("/authentication", signinRouter);

// --------------- USER ROUTES ----------------
app.use("/user", authMiddleWare, userAuth, userRouter);

// ---------------- ADMIN ROUTES ----------------
app.use("/admin", authMiddleWare, adminAuth, adminRouter);

const URI = `mongodb+srv://mihirpetkar2006_db_user:${process.env.DBPASSWORD}@cluster0.lnicn3r.mongodb.net/fostride`;
mongoose
    .connect(URI)
    .then(() => console.log("Connected to DB!"))
    .catch((e) => console.log(`Error connecting to DB: ${e}`));

app.listen(PORT, () => {
    console.log(`App listening on Port ${PORT}`);
});
