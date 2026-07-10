/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../services/database.js';
export async function getExercises() {
    return [
        { id: '1', name: 'Bench Press', primaryMuscle: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: ['Barbell', 'Bench'], difficulty: 'intermediate', tags: ['compound'] },
        { id: '2', name: 'Squats', primaryMuscle: 'Quads', secondaryMuscles: ['Glutes', 'Hamstrings'], equipment: ['Barbell'], difficulty: 'intermediate', tags: ['compound'] },
        { id: '3', name: 'Deadlift', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes', 'Back'], equipment: ['Barbell'], difficulty: 'advanced', tags: ['compound'] },
    ];
}
export async function getTemplates() {
    return [
        { id: '1', name: 'Push Day', description: 'Chest & Triceps', difficulty: 'intermediate', duration: 45, workoutsPerWeek: 3, exercises: [] },
        { id: '2', name: 'Pull Day', description: 'Back & Biceps', difficulty: 'intermediate', duration: 45, workoutsPerWeek: 3, exercises: [] },
        { id: '3', name: 'Legs Day', description: 'Quads & Hamstrings', difficulty: 'advanced', duration: 60, workoutsPerWeek: 2, exercises: [] },
    ];
}
export async function getWorkoutHistory(userId) {
    return prisma.workout.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
export async function getPersonalRecords(userId) {
    return prisma.personalRecord.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
    });
}
export async function getAnalytics(userId) {
    const workouts = await prisma.workout.findMany({
        where: { userId, completedAt: { not: null } },
    });
    let totalVolume = 0;
    for (const w of workouts) {
        totalVolume += w.duration;
    }
    return {
        weeklyVolume: totalVolume,
        monthlyVolume: totalVolume * 4,
        muscleBalance: { Chest: 25, Back: 20, Legs: 30, Shoulders: 15, Arms: 10 },
        workoutFrequency: workouts.length,
        consistencyScore: 85,
        strengthProgress: [{ exercise: 'Bench Press', current: 225, previous: 205 }],
    };
}
export async function createWorkout(userId, data) {
    return prisma.workout.create({
        data: {
            userId,
            name: data.name,
            type: data.type,
            difficulty: data.difficulty,
            duration: data.duration,
            sections: data.sections || [],
        },
    });
}
export async function startWorkout(userId, workoutId) {
    const workout = await prisma.workout.findFirst({
        where: { id: workoutId, userId },
    });
    if (!workout) {
        throw new Error('Workout not found');
    }
    return { ...workout, status: 'started' };
}
export async function completeSet(userId, workoutId, setId, data) {
    return { id: setId, ...data, completed: true };
}
export async function completeWorkout(userId, workoutId) {
    const workout = await prisma.workout.updateMany({
        where: { id: workoutId, userId },
        data: { completedAt: new Date() },
    });
    if (workout.count === 0) {
        throw new Error('Workout not found');
    }
    return { status: 'completed', completedAt: new Date().toISOString() };
}
