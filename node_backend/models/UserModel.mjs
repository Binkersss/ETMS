import db from '../db.mjs';

export async function findById(userId) {
  const [rows] = await db.query('SELECT * FROM Users WHERE user_id = ?', [userId]);
  return rows[0];
}

export async function update(userId, updates) {
  const { username, email } = updates;
  await db.query('UPDATE Users SET username = ?, email = ? WHERE user_id = ?', [username, email, userId]);
  return findById(userId);
}
