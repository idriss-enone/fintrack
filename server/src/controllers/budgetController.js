import * as budgetModel from "../models/budgetModel.js";
import * as categoryModel from "../models/categoryModel.js";
import { parseId, isMissing, normalizeAmount } from "../validators/commonValidator.js";
import { validateCreate, validateUpdate } from "../validators/budgetValidator.js";



export async function getBudgets(req, res) {
    try {
        const budgets = await budgetModel.findAllByUser(req.userId);
        res.json(budgets);
    } catch (error) {
        console.error('GetBudgets error', error);
        res.status(500).json({ message: 'server error' });
    }
}

export async function createBudget(req, res) {
    const input = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};

    const errors = validateCreate(input);
    if (errors) {
        return res.status(400).json({
            message: 'Validation failed',
            errors,
        });
    }

    try {
        const categoryId = Number(input.categoryId);
        const amount = Number(normalizeAmount(input.amount));
        const period = isMissing(input.period) ? 'monthly' : String(input.period).trim();
        const startDate = isMissing(input.startDate) ? null : input.startDate;
        // La catégorie doit exister, appartenir à l'utilisateur et être une catégorie de dépenses
        const category = await categoryModel.findByIdAndUser(categoryId, req.userId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        if (category.type !== 'expense') {
            return res.status(400).json({ message: "A budget can only be set on an expense category" });
        }



        const budget = await budgetModel.create(req.userId, {
            category_id: category.id,
            amount: amount,
            period: period,
            start_date:startDate
        });
        res.status(201).json(budget);
    } catch (error) {
        // 23505 = violation d'unicité (user_id, category_id, period)
        if (error.code === '23505') {
            return res.status(409).json({ message: "A budget already exists for this category and period" });
        }
        // 23503 = clé étrangère : la catégorie a été supprimée juste après la vérification
        if (error.code === '23503') {
            return res.status(404).json({ message: "Category not found" });
        }
        console.error('CreateBudget error', error);
        res.status(500).json({ message: 'server error' });
    }
}

export async function updateBudget(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid budget id" });
    }

    const input = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};

    const errors = validateUpdate(input);
    if (errors) {
        return res.status(400).json({
            message: 'Validation failed',
            errors,
        });
    }

    try {
        const userId = req.userId;
        const amount = !isMissing(input.amount) ? Number(normalizeAmount(input.amount)) : null;
        const period = !isMissing(input.period) ? String(input.period).trim() : null;
        const start_date = !isMissing(input.startDate) ? input.startDate : null;


        const budget = await budgetModel.update(id, userId, {
            amount,
            period,
            start_date
        });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.json(budget);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: "A budget already exists for this category and period" });
        }
        console.error('UpdateBudget error', error);
        res.status(500).json({ message: 'server error' });
    }
}

export async function deleteBudget(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid budget id" });
    }

    try {
        const deleted = await budgetModel.remove(id, req.userId);
        if (!deleted) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.json({ message: "Budget deleted" });
    } catch (error) {
        console.error('DeleteBudget error', error);
        res.status(500).json({ message: 'server error' });
    }
}