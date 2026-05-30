import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5500";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Karthificial Node.js backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Karthificial Node.js backend health check passed"
  });
});

app.listen(PORT, () => {
  console.log(`Karthificial backend running on port ${PORT}`);
});