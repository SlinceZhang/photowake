import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserDto, UserDto } from './dto';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [
    {
      id: 'f73faea1-0f73-4bf5-8345-2e3f7c954a39',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      avatarUrl: 'https://example.com/avatar/jane.png',
    },
    {
      id: '493105de-7b78-4a95-87b1-c592373c1701',
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatarUrl: 'https://example.com/avatar/john.png',
    },
  ];

  async findAll(): Promise<UserDto[]> {
    return this.users;
  }

  async create(payload: CreateUserDto): Promise<UserDto> {
    const newUser: UserDto = {
      id: randomUUID(),
      ...payload,
    };
    this.users.push(newUser);
    return newUser;
  }
}
