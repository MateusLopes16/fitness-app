export interface MealSchedule {
  id: string;
  userId: string;
  mealId: string;
  date: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  completed: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  meal: {
    id: string;
    name: string;
    description?: string;
    recipe?: string;
    servings: number;
    ingredients: Array<{
      id: string;
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
    }>;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber?: number;
    totalSugar?: number;
    totalSodium?: number;
  };
}

export interface CreateMealScheduleDto {
  mealId: string;
  date: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  notes?: string;
}

export interface UpdateMealScheduleDto {
  mealId?: string;
  date?: string;
  mealType?: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  completed?: boolean;
  notes?: string;
}

export interface MealScheduleQueryDto {
  date?: string;
  startDate?: string;
  endDate?: string;
  mealType?: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  completed?: boolean;
}
