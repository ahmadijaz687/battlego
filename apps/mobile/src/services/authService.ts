import { apiClient, setTokens, clearTokens, ApiResponse } from './apiClient';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  error: string;
}

export async function login(email: string, password: string): Promise<AuthData> {
  const response = await apiClient.post<ApiResponse<AuthData>>('/auth/login', { email, password });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Login failed');
  }
  setTokens(response.data.data.accessToken, response.data.data.refreshToken);
  return response.data.data;
}

export async function register(email: string, password: string, name: string): Promise<AuthData> {
  const response = await apiClient.post<ApiResponse<AuthData>>('/auth/register', { email, password, name });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Registration failed');
  }
  setTokens(response.data.data.accessToken, response.data.data.refreshToken);
  return response.data.data;
}

export async function getProfile(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>('/profile');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to get profile');
  }
  return response.data.data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore errors on logout
  }
  clearTokens();
}

export async function socialLogin(
  provider: string,
  idToken: string,
): Promise<AuthData> {
  const response = await apiClient.post<ApiResponse<AuthData>>('/auth/social', {
    provider,
    idToken,
  });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Social login failed');
  }
  setTokens(response.data.data.accessToken, response.data.data.refreshToken);
  return response.data.data;
}
