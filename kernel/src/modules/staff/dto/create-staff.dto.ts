import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateStaffDto {
  // Compte User auquel l'agent est rattaché
  @IsUUID()
  userId: string;

  @IsString()
  matricule: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  staffRole?: string;
}
