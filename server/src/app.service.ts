import { Injectable } from '@nestjs/common';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error: string | null;
}

@Injectable()
export class AppService {
  async getUsers(): Promise<ApiResponse<string>> {
    return {
      data: 'hello world',
      message: 'API is reachable',
      error: null,
    };
  }
}
