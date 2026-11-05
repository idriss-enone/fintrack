import * as categoryModel from "../models/categoryModel.js";
import {
    parseId,
    validateTypeFilter,
    validateCreate,
    validateUpdate
} from "../validators/categoryValidator.js";


export async function getCategories(req, res) {
    const { type } = req.query; // optionnel : /api/categories?type=expense

    const validationError = validateTypeFilter(type);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const categories = await categoryModel.findAllByUser(req.userId, type);
        res.json(categories);
    } catch (error) {
        console.log('GetCategories error', error);
        res.status(500).json({ message: 'server error' });
    }
}

export async function createCategory(req, res) {
    const input = req.body ?? {};

    const validationError = validateCreate(input);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const category = await categoryModel.create(req.userId, {
            name: input.name.trim(),
            type: input.type,
            icon: input.icon ?? null,
            color: input.color ?? null
        });
        res.status(201).json(category);
    } catch (error) {
        // 23505 = violation d'unicité (user_id, name, type)
        if (error.code === '23505') {
            return res.status(409).json({ message: "This category name already exists" });
        }
        console.error('CreateCategory error', error);
        res.status(500).json({ message: 'server error' });
    }
}

export async function updateCategory(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid category id" });
    }

    const input = req.body ?? {};

    const validationError = validateUpdate(input);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const category = await categoryModel.update(id, req.userId, {
            name: input.name?.trim() ?? null,
            icon: input.icon ?? null,
            color: input.color ?? null
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: "This category name already exists" });
        }
        console.error('UpdateCategory error', error);
        res.status(500).json({ message: 'server error' });
    }
}

export async function deleteCategory(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid category id" });
    }

    try {
        const deleted = await categoryModel.remove(id, req.userId);
        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }
        // Ses transactions et récurrents deviennent "sans catégorie" (ON DELETE SET NULL)
        res.json({ message: "Category deleted" });
    } catch (error) {
        console.error('DeleteCategory error', error);
        res.status(500).json({ message: 'server error' });
    }
}