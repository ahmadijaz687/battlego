import { getExercises, getTemplates, getWorkoutHistory, getPersonalRecords, getAnalytics, createWorkout, startWorkout, completeSet, completeWorkout, } from '../services/workoutService.js';
export const getExercisesHandler = async (_req, res) => {
    try {
        const exercises = await getExercises();
        res.json(exercises);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch exercises' });
    }
};
export const getTemplatesHandler = async (_req, res) => {
    try {
        const templates = await getTemplates();
        res.json(templates);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
};
export const getWorkoutHistoryHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const workouts = await getWorkoutHistory(userId);
        res.json(workouts);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};
export const getPersonalRecordsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const records = await getPersonalRecords(userId);
        res.json(records);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch records' });
    }
};
export const getAnalyticsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const analytics = await getAnalytics(userId);
        res.json(analytics);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};
export const createWorkoutHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const workout = await createWorkout(userId, req.body);
        res.status(201).json(workout);
    }
    catch {
        res.status(500).json({ error: 'Failed to create workout' });
    }
};
export const startWorkoutHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        const workoutId = Array.isArray(req.params.workoutId)
            ? req.params.workoutId[0]
            : req.params.workoutId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const workout = await startWorkout(userId, workoutId);
        res.json(workout);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to start workout';
        res.status(404).json({ error: message });
    }
};
export const completeSetHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        const workoutId = Array.isArray(req.params.workoutId)
            ? req.params.workoutId[0]
            : req.params.workoutId;
        const setId = Array.isArray(req.params.setId)
            ? req.params.setId[0]
            : req.params.setId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const set = await completeSet(userId, workoutId, setId, req.body);
        res.json(set);
    }
    catch {
        res.status(500).json({ error: 'Failed to complete set' });
    }
};
export const completeWorkoutHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        const workoutId = Array.isArray(req.params.workoutId)
            ? req.params.workoutId[0]
            : req.params.workoutId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const result = await completeWorkout(userId, workoutId);
        res.json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to complete workout';
        res.status(404).json({ error: message });
    }
};
