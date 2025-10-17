import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UserDto extends CreateUserDto {
  @ApiProperty({
    format: 'uuid',
    example: 'f73faea1-0f73-4bf5-8345-2e3f7c954a39',
  })
  @IsUUID()
  id!: string;
}
