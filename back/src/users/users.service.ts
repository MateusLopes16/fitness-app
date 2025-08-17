import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    
    const { password, ...userData } = createUserDto;
    
    const user = await this.database.user.create({
      data: {
        ...userData,
        passwordHash: hashedPassword,
        dateOfBirth: createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        height: true,
        weight: true,
        dateOfBirth: true,
        activityLevel: true,
        objective: true,
        workoutsPerWeek: true,
        goals: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    return this.database.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        height: true,
        weight: true,
        dateOfBirth: true,
        activityLevel: true,
        objective: true,
        workoutsPerWeek: true,
        goals: true,
        role: true,
        passwordHash: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.database.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        height: true,
        weight: true,
        dateOfBirth: true,
        activityLevel: true,
        objective: true,
        workoutsPerWeek: true,
        goals: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateData: any = { ...updateUserDto };
    
    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 12);
      delete updateData.password;
    }

    if (updateUserDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateUserDto.dateOfBirth);
    }

    const user = await this.database.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        height: true,
        weight: true,
        dateOfBirth: true,
        activityLevel: true,
        objective: true,
        workoutsPerWeek: true,
        goals: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async remove(id: string) {
    await this.database.user.delete({
      where: { id },
    });
  }
}
