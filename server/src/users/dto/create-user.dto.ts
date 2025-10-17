import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar/jane.png',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
