import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(dto: CreateUserDto): User {
    const user: User = {
      id: crypto.randomUUID(),
      email: dto.email,
      password: dto.password,
      roles: dto.roles || ['user'],
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  update(id: string, dto: UpdateUserDto): User | undefined {
    const user = this.findOne(id);
    if (!user) return undefined;
    Object.assign(user, dto);
    return user;
  }

  remove(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
