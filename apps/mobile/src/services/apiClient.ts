import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getItem, setItem, removeItem, storageKeys } from '../utils/storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.100.11:5000/api/v1';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;
  errors?: string[];
}

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let accessToken: string | null = getItem<string>(storageKeys.auth.accessToken) || null;
let refreshToken: string | null = getItem<string>(storageKeys.auth.refreshToken) || null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  setItem(storageKeys.auth.accessToken, access);
  setItem(storageKeys.auth.refreshToken, refresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  removeItem(storageKeys.auth.accessToken);
  removeItem(storageKeys.auth.refreshToken);
};

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (refreshToken) {
        try {
          const response = await axios.post<ApiResponse<{ accessToken: string }>>(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );
          const newToken = response.data.data?.accessToken;
          if (newToken) {
            accessToken = newToken;
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return apiClient(originalRequest);
          }
        } catch {
          accessToken = null;
          refreshToken = null;
        }
      }
    }

    return Promise.reject(error);
  }
);
