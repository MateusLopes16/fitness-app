import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealType } from '@prisma/client';

export class MealIngredientDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ingredientId: string;

  @ApiProperty()
  quantityGrams: number;

  @ApiProperty()
  ingredient: {
    id: string;
    name: string;
    brand?: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    fiberPer100g?: number;
    sugarPer100g?: number;
    sodiumPer100g?: number;
  };
}

export class MealDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  recipe?: string;

  @ApiPropertyOptional({ enum: MealType })
  mealType?: MealType;

  @ApiPropertyOptional()
  date?: string;

  @ApiProperty()
  servings: number;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiProperty()
  createdByType: 'admin' | 'user';

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [MealIngredientDto] })
  ingredients: MealIngredientDto[];

  // Calculated nutritional values
  @ApiProperty()
  totalCalories: number;

  @ApiProperty()
  totalProtein: number;

  @ApiProperty()
  totalCarbs: number;

  @ApiProperty()
  totalFat: number;

  @ApiPropertyOptional()
  totalFiber?: number;

  @ApiPropertyOptional()
  totalSugar?: number;

  @ApiPropertyOptional()
  totalSodium?: number;
}
