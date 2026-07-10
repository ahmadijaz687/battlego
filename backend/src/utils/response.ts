export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;
  errors?: string[];
}

export function successResponse<T>(data: T, message = 'Success', meta?: Record<string, unknown>): ApiResponse<T> {
  return { success: true, message, data, meta };
}

export function errorResponse(message = 'Error', errors?: string[]): ApiResponse<null> {
  return { success: false, message, data: null, errors };
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
): ApiResponse<T[]> {
  return {
    success: true,
    message,
    data: items,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
