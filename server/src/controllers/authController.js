import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as userModel from "../models/userModel.js";
import * as categoryModel from "../models/categoryModel.js";
import { withTransaction } from "../db.js";
import defaultCategories from "../utils/defaultCategories.js";
import {
    normalizeEmail,
    normalizeCurrency,
    validateRegister,
    validateLogin
} from "../validators/authValidator.js";


const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

export async function register(req, res) {
    const body = req.body ?? {};
    const input = {
        name: body.name,
        email: normalizeEmail(body.email),
        password: body.password,
        currency: normalizeCurrency(body.currency)
    };

    const validationError = validateRegister(input);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(input.password, salt);

        // Création de l'utilisateur + ses catégories par défaut : tout ou rien
        const user = await withTransaction(async (client) => {
            const newUser = await userModel.create({
                name: input.name.trim(),
                email: input.email,
                passwordHash,
                currency: input.currency
            }, client);
            await categoryModel.createDefaults(newUser.id, defaultCategories, client);
            return newUser;
        });

        res.status(201).json({ user, token: signToken(user.id) });
    } catch (error) {
        // 23505 = violation d'unicité : l'email existe déjà
        if (error.code === '23505') {
            return res.status(409).json({ message: "Email already registered" });
        }
        console.log('Register error', error);
        res.status(500).json({ message: 'server error' });
    }
}

export async function login(req, res) {
    const body = req.body ?? {};
    const input = {
        email: normalizeEmail(body.email),
        password: body.password
    };

    const validationError = validateLogin(input);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        // 1. L'utilisateur existe-t-il ?
        const user = await userModel.findByEmail(input.email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 2. Le mot de passe est-il correct ?
        const match = await bcrypt.compare(input.password, user.password_hash);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                currency: user.currency
            },
            token: signToken(user.id)
        });
    } catch (error) {
        console.log('Login error', error);
        res.status(500).json({ message: 'server error' });
    }
}

export async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.log('GetMe error', error);
        res.status(500).json({ message: 'server error' });
    }
}