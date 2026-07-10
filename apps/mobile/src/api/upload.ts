import { apiClient, ApiResponse } from './client';

export const uploadApi = {
  uploadImage: (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadAvatar: (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse>('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadVideo: (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse>('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
