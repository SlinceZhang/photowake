export interface BaseResponseErrorDto {
  message: string;
  statusCode?: number;
  details?: unknown;
}

export class BaseResponseDto<T = unknown> {
  success: boolean;
  data: T | null;
  error: BaseResponseErrorDto | null;

  constructor(options: { success: boolean; data?: T | null; error?: BaseResponseErrorDto | null }) {
    this.success = options.success;
    this.data = options.data ?? null;
    this.error = options.error ?? null;
  }

  static success<DataType>(data: DataType): BaseResponseDto<DataType> {
    return new BaseResponseDto<DataType>({ success: true, data, error: null });
  }

  static failure(message: string, statusCode?: number, details?: unknown): BaseResponseDto<null> {
    return new BaseResponseDto<null>({
      success: false,
      data: null,
      error: { message, statusCode, details },
    });
  }
}
