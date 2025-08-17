import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
  MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
  EXTREMELY_ACTIVE = 'EXTREMELY_ACTIVE',
}

enum FitnessObjective {
  BULK = 'BULK',
  LEAN = 'LEAN',
  MAINTAIN = 'MAINTAIN',
}

export class RegisterDto {
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
  height?: number;

  @ApiPropertyOptional({ example: 70.2 })
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

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
  workoutsPerWeek?: number;
}
