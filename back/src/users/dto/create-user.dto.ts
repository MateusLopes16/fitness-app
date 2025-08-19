import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
  MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
  EXTREMELY_ACTIVE = 'EXTREMELY_ACTIVE',
}

export enum FitnessObjective {
  BULK = 'BULK',
  LEAN = 'LEAN',
  MAINTAIN = 'MAINTAIN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 175.5 })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ example: 70.2 })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: ActivityLevel, example: ActivityLevel.MODERATELY_ACTIVE })
  @IsOptional()
  @IsEnum(ActivityLevel)
  activityLevel?: ActivityLevel;

  @ApiPropertyOptional({ enum: FitnessObjective, example: FitnessObjective.MAINTAIN })
  @IsOptional()
  @IsEnum(FitnessObjective)
  objective?: FitnessObjective;

  @ApiPropertyOptional({ example: 3, minimum: 0, maximum: 7 })
  @IsOptional()
  @IsNumber()
  workoutsPerWeek?: number;

  @ApiPropertyOptional({ example: { weightLoss: true, muscleGain: false } })
  @IsOptional()
  goals?: any;
}
