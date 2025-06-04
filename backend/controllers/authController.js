import db from '../models/db.js';

export const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.promise().query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password]
        );

        if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user: rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}