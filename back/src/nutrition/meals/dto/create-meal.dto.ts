import { IsString, IsOptional, IsEnum, IsDateString, IsInt, Min, IsArray, ValidateNested, IsBoolean, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealType } from '@prisma/client';

export class CreateMealIngredientDto {
  @ApiProperty({ description: 'Ingredient ID' })
  @IsUUID('4')
  ingredientId: string;

  @ApiProperty({ description: 'Quantity in grams' })
  @IsString()
  quantityGrams: string;
}

export class CreateMealDto {
  @ApiProperty({ description: 'Name of the meal' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the meal' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Recipe instructions' })
  @IsOptional()
  @IsString()
  recipe?: string;

  @ApiPropertyOptional({ enum: MealType, description: 'Type of meal' })
  @IsOptional()
  @IsEnum(MealType)
  mealType?: MealType;

  @ApiPropertyOptional({ description: 'Date for the meal (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ description: 'Number of servings', default: 1 })
  @IsInt()
  @Min(1)
  servings: number = 1;

  @ApiProperty({ description: 'List of ingredients with quantities', type: [CreateMealIngredientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMealIngredientDto)
  ingredients: CreateMealIngredientDto[];
}
