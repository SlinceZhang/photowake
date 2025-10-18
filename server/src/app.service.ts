import { Injectable } from '@nestjs/common';
import { BaseResponseDto } from './common/dto/base-response.dto';

@Injectable()
export class AppService {
  async getUsers(): Promise<BaseResponseDto<string>> {
    return BaseResponseDto.success('Hello World!');
  }
}
