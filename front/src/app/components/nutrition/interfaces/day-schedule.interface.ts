import { Meal, MealType } from './meal.interface';

export interface DayMeal {
  id: string;
  meal: Meal;
  mealType: MealType;
  scheduledTime?: string; // Optional time like "08:00", "12:30"
  portionMultiplier: number; // 1.0 = full portion, 0.5 = half portion, etc.
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD format
  meals: DayMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber?: number;
  totalSugar?: number;
  totalSodium?: number;
}

export interface MacroSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export enum SidePanelState {
  CLOSED = 'CLOSED',
  MEALS_LIST = 'MEALS_LIST', 
  MEAL_DETAILS = 'MEAL_DETAILS'
}