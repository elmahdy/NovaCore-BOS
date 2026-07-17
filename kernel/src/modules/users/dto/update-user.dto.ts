import { IsEmail, IsString, MinLength, IsArray, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsArray()
  @IsOptional()
  roles?: string[];
}
