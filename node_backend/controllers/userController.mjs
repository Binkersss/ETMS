import * as UserModel from '../models/UserModel.mjs';

export async function getUserById(req, res) {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function updateUser(req, res) {
  try {
    const updated = await UserModel.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
