import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Staff } from './staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class StaffService {
  private staff: Staff[] = [];

  // Dépend de UsersService pour valider le lien vers le compte User
  constructor(private readonly usersService: UsersService) {}

  create(dto: CreateStaffDto): Staff {
    // Le compte User référencé doit exister
    const user = this.usersService.findOne(dto.userId);
    if (!user) {
      throw new BadRequestException(`User ${dto.userId} introuvable`);
    }
    // Un User ne peut être lié qu'à un seul compte staff
    if (this.staff.some((s) => s.userId === dto.userId)) {
      throw new BadRequestException(
        `Un compte staff existe déjà pour l'utilisateur ${dto.userId}`,
      );
    }

    const item: Staff = {
      id: crypto.randomUUID(),
      userId: dto.userId,
      matricule: dto.matricule,
      firstName: dto.firstName,
      lastName: dto.lastName,
      position: dto.position,
      department: dto.department,
      staffRole: dto.staffRole || 'agent',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.staff.push(item);
    return item;
  }

  findAll(): Staff[] {
    return this.staff;
  }

  findOne(id: string): Staff {
    const item = this.staff.find((s) => s.id === id);
    if (!item) throw new NotFoundException(`Staff ${id} introuvable`);
    return item;
  }

  // Retrouver l'agent à partir du compte User lié
  findByUserId(userId: string): Staff | undefined {
    return this.staff.find((s) => s.userId === userId);
  }

  update(id: string, dto: UpdateStaffDto): Staff {
    const item = this.findOne(id);
    Object.assign(item, dto, { updatedAt: new Date() });
    return item;
  }

  remove(id: string): boolean {
    const index = this.staff.findIndex((s) => s.id === id);
    if (index === -1) throw new NotFoundException(`Staff ${id} introuvable`);
    this.staff.splice(index, 1);
    return true;
  }
}
