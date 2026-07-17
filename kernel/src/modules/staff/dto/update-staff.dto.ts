import { IsString, IsOptional } from 'class-validator';

export class UpdateStaffDto {
  @IsOptional()
  @IsString()
  matricule?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  staffRole?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
