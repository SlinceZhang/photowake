import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponseDto } from './common/dto/base-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  async getUsers(): Promise<BaseResponseDto<string>> {
    return this.appService.getUsers();
  }
}
