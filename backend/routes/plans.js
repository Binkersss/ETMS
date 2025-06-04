import express from 'express';

import { getAllPlans, getPlanByCoach, getWorkoutsByUserAndPlan } from '../controllers/plansController.js';

const app = express();

app.get('/plans', getAllPlans);
app.get('/plans/:id', getPlanByCoach);
app.get('/plans/:user_id/:plan_id', getWorkoutsByUserAndPlan)

export default app;