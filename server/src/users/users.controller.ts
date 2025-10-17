import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse, ResponseEnvelopeDto, buildResponse } from '../common';
import { CreateUserDto, UserDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({
    description: 'List of users',
    isArray: true,
    model: UserDto,
  })
  async findAll(): Promise<ResponseEnvelopeDto<UserDto[]>> {
    const users = await this.usersService.findAll();
    return buildResponse(users, 'Users retrieved successfully');
  }

  @Post()
  @ApiResponse({
    description: 'Created user details',
    model: UserDto,
    status: 201,
  })
  async create(
    @Body() payload: CreateUserDto,
  ): Promise<ResponseEnvelopeDto<UserDto>> {
    const user = await this.usersService.create(payload);
    return buildResponse(user, 'User created successfully');
  }
}
