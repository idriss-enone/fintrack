import * as transactionModel from "../models/transactionModel.js";
import * as categoryModel from "../models/categoryModel.js";
import { parseId, toNumber, normalizeText } from "../validators/commonValidator.js";
import {
    validateCreate,
    validateUpdate,
    validateListFilters
} from "../validators/transactionValidator.js";

const DEFAULT_LIMIT = 50;

const INVALID_CATEGORY =
    "Invalid category (it must exist and have the same type as the transaction)";


// La catégorie doit exister, appartenir à l'utilisateur et avoir le même type que la transaction
async function isValidUserCategory(userId, categoryId, type) {
    const category = await categoryModel.findByIdAndUser(Number(categoryId), userId);
    return category !== null && category.type === type;
}


export async function getTransactions(req, res) {
    const query = req.query;

    const validationError = validateListFilters(query);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const transactions = await transactionModel.findAllByUser(req.userId, {
            type: query.type ?? null,
            categoryId: query.categoryId === undefined ? null : Number(query.categoryId),
            from: query.from ?? null,
            to: query.to ?? null,
            search: normalizeText(query.search) ?? null,
            limit: query.limit === undefined ? DEFAULT_LIMIT : Number(query.limit),
            offset: query.offset === undefined ? 0 : Number(query.offset)
        });
        res.json(transactions);
    } catch (error) {
        console.error('GetTransactions error', error);
        res.status(500).json({ message: 'server error' });
    }
}



export async function createTransaction(req, res) {
    const input = req.body ?? {};
    const validationError = validateCreate(input);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }
    const categoryId = input.category_id ?? null; // null = "sans catégorie"
    try {
        if (categoryId !== null && !(await isValidUserCategory(req.userId, categoryId, input.type))) {
            return res.status(400).json({ message: INVALID_CATEGORY });
        }

        const transaction = await transactionModel.create(req.userId, {
            category_id: toNumber(categoryId),
            amount: Number(input.amount),
            type: input.type,
            description: normalizeText(input.description) ?? null,
            notes: normalizeText(input.notes) ?? null,
            transaction_date: input.transaction_date
        });
        res.status(201).json(transaction);

    }
    catch (error) {
        // 23503 = clé étrangère : la catégorie a été supprimée juste après la vérification
        if (error.code === '23503') {
            return res.status(400).json({ message: INVALID_CATEGORY });
        }
        console.error('CreateTransaction error', error);
        res.status(500).json({ message: 'server error' });
    }
}

export async function updateTransaction(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid transaction id" });
    }

    const input = req.body ?? {};
    const validationError = validateUpdate(input);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const current = await transactionModel.findByIdAndUser(id, req.userId);
        if (!current) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        // Si le type ou la catégorie change, le couple final (catégorie, type) doit rester cohérent
        const pairChanged = input.type !== undefined || input.category_id !== undefined;
        const finalType = input.type ?? current.type;
        const finalCategoryId = input.category_id !== undefined ? input.category_id : current.category_id;

        if (pairChanged && finalCategoryId !== null
            && !(await isValidUserCategory(req.userId, finalCategoryId, finalType))) {
            return res.status(400).json({ message: INVALID_CATEGORY });
        }


        const transaction = await transactionModel.update(id, req.userId, {
            category_id: toNumber(input.category_id),
            amount: toNumber(input.amount),
            type: input.type,
            description: normalizeText(input.description),
            notes: normalizeText(input.notes),
            transaction_date: input.transaction_date
        });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json(transaction);

    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ message: INVALID_CATEGORY });
        }
        console.error('UpdateTransaction error', error);
        res.status(500).json({ message: 'server error' });
    }
}
export async function deleteTransaction(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid transaction id" });
    }

    try {
        const deleted = await transactionModel.remove(id, req.userId);
        if (!deleted) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted" });
    } catch (error) {
        console.error('DeleteTransaction error', error);
        res.status(500).json({ message: 'server error' });
    }
}