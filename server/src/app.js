import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Fintrack API est opérationnel",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  console.error("Unhandled server error", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
