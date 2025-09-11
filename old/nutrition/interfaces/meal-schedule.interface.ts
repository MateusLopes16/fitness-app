import { Meal } from './meal.interface';

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
  meal: Meal;
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
