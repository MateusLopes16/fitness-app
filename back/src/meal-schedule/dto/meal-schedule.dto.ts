import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, IsBoolean } from 'class-validator';
import { MealType } from '@prisma/client';

export class CreateMealScheduleDto {
  @IsUUID()
  mealId: string;

  @IsDateString()
  date: string;

  @IsEnum(MealType)
  mealType: MealType;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMealScheduleDto {
  @IsOptional()
  @IsUUID()
  mealId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsEnum(MealType)
  mealType?: MealType;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class MealScheduleQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(MealType)
  mealType?: MealType;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
