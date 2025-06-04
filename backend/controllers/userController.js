import db from '../models/db.js';

export const getAllUsers = async(req, res) => {
    try {
        const data = await db.promise().query(
            `SELECT * from users;`
        );
        res.status(200).json({
            users: data[0],
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
};

export const getUserById = async(req, res) => {
    try {
        const {id} = req.params;
        const data = await db.promise().query(
            `SELECT * from users where user_id = ?`,[id]
        );
        
        if (data.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: data[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const createNewUser = async(req, res) => {
    try {
        const { username, password, email, role } = req.body;
        const [{ insertID }] = await db.promise().query(
            `INSERT INTO users (username, password, email, role)
                VALUES (?, ?, ?, ?)`
            [username, password, email, role]
        );
        res.status(202).json({
            message: "User Created",
            username: `${username}`,
            password: `${password}`,
            email: `${email}`,
            role: `${role}`,
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
}

export const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const { username, password, email, rol } = req.body;

        const fields = [];
        const values = [];

        if (username) {
            fields.push('username = ?');
            values.push(username);
        }
        if (password) {
            fields.push('password = ?');
            values.push(password);
        }
        if (email) {
            fields.push('email = ?');
            values.push(email);
        }
        if (role) {
            fields.push('email = ?');
            values.push(role);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        values.push(id);

        const [result] = await db.promise().query(
            `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        const update = await db
            .promise()
            .query(
                `DELETE FROM users where user_id = ?`,
                [id]
            );
        res.status(200).json({
            message: "deleted",
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
}

export const getAllCoaches = async(req, res) => {
    try {
        const data = await db
            .promise()
            .query(
                `SELECT * FROM users WHERE role = 'coach';`
            );
        res.status(200).json({
            coaches: data[0],
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
}