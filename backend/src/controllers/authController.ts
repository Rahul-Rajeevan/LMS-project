import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/database';

const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, role]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {  // 👈 Explicitly type `error` as `any`
        console.error(error);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
    
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const [users]: any = await pool.execute(`SELECT * FROM users WHERE email = ?`, [email]);

        if (users.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });
        console.log(token);
        res.json({ token });
    }    catch (error: any) {
        console.error("Error:", error); // Logs error details in the console
        res.status(500).json({ error: error.message || 'An unexpected error occurred' });
    }

};

module.exports = { register, login };