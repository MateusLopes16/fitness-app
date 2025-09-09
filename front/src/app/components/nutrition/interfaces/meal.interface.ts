export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK'
}

export interface MealIngredient {
  id: string;
  ingredientId: string;
  quantityGrams: number;
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

export interface Meal {
  id: string;
  name: string;
  description?: string;
  recipe?: string;
  mealType?: MealType;
  date?: string;
  servings: number;
  createdBy?: string;
  createdByType: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  ingredients: MealIngredient[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber?: number;
  totalSugar?: number;
  totalSodium?: number;
}

export interface CreateMealIngredientDto {
  ingredientId: string;
  quantityGrams: string;
}

export interface CreateMealDto {
  name: string;
  description?: string;
  recipe?: string;
  mealType?: MealType;
  date?: string;
  servings: number;
  ingredients: CreateMealIngredientDto[];
}

export interface UpdateMealDto extends Partial<CreateMealDto> {}

export interface DuplicateMealDto {
  mealType?: MealType;
  date?: string;
}
