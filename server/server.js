import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const sql = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
    await db.execute(sql, [fullName, email, password]);

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});