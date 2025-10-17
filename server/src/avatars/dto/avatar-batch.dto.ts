import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AvatarBatchDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids!: string[];
}
