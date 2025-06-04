import db from '../models/db.js';

export const getAllPlans = async(req, res) => {
    try {
        const data = await db.promise().query(
            `SELECT * from trainingplans;`
        );
        res.status(200).json({
            plans: data[0],
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
};

export const getPlanByCoach = async(req, res) => {
    try {
        const id = req.params.id;
        const data = await db.promise().query(
            `SELECT tp.plan_id, tp.title, tp.description, tp.start_date, tp.end_date
             FROM trainingplans tp
             JOIN users u ON tp.coach_id = u.user_id
             WHERE u.role = 'coach' AND u.user_id = ?;`, 
            [id]
        );
        res.status(200).json({
            plans: data[0],
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
};

export const getWorkoutsByUserAndPlan = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const plan_id = req.params.plan_id;

        const data = await db.promise().query(
            `SELECT w.*, tp.title as plan_title, u.username
             FROM workouts w
             JOIN trainingplans tp ON w.plan_id = tp.plan_id
             JOIN users u on w.user_id = u.user_id
             WHERE w.user_id = ? AND w.plan_id = ?;`,
             [user_id, plan_id]
        );
        res.status(200).json({
            workouts: data[0],
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
};