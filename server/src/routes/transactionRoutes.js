import express from "express";
import {
    getTransactions,
    createTransaction,
    analyzeTransaction,
    updateTransaction,
    deleteTransaction
} from "../controllers/transactionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate); // toutes les routes transactions nécessitent d'être connecté

router.get("/", getTransactions);
router.post("/", createTransaction);
router.post("/analyze", analyzeTransaction);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;