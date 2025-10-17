import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class CursorPaginationDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : value))
  @IsInt()
  @IsPositive()
  @Max(50)
  limit?: number;
}
