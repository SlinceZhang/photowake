import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse, AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  @ApiOperation({ summary: 'Basic connectivity check for the PhotoWake API' })
  @ApiOkResponse({
    description: 'Standard API response envelope',
    schema: {
      example: {
        data: 'hello world',
        message: 'API is reachable',
        error: null,
      },
    },
  })
  async getUsers(): Promise<ApiResponse<string>> {
    return this.appService.getUsers();
  }
}
