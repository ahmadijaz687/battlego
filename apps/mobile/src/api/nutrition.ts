import { apiClient, ApiResponse } from './client';

export const nutritionApi = {
  getFoods: (search?: string) =>
    apiClient.get<ApiResponse>('/nutrition/foods', { params: { search } }),

  createFood: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/nutrition/foods', data),

  getMeals: (date?: string) =>
    apiClient.get<ApiResponse>('/nutrition/meals', { params: { date } }),

  createMeal: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/nutrition/meals', data),

  updateMeal: (mealId: string, data: Record<string, unknown>) =>
    apiClient.put<ApiResponse>(`/nutrition/meals/${mealId}`, data),

  deleteMeal: (mealId: string) =>
    apiClient.delete<ApiResponse>(`/nutrition/meals/${mealId}`),

  getWaterLogs: (date?: string) =>
    apiClient.get<ApiResponse>('/nutrition/water/logs', { params: { date } }),

  logWater: (amount: number) =>
    apiClient.post<ApiResponse>('/nutrition/water/logs', { amount }),

  getWeightLogs: () =>
    apiClient.get<ApiResponse>('/nutrition/weight/logs'),

  logWeight: (weight: number, unit: string) =>
    apiClient.post<ApiResponse>('/nutrition/weight/logs', { weight, unit }),

  getMeasurements: () =>
    apiClient.get<ApiResponse>('/nutrition/measurements'),

  createMeasurement: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse>('/nutrition/measurements', data),

  getNutritionAnalytics: () =>
    apiClient.get<ApiResponse>('/nutrition/analytics'),

  getShoppingList: () =>
    apiClient.get<ApiResponse>('/nutrition/shopping-list'),
};
