export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function buildApiResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}
