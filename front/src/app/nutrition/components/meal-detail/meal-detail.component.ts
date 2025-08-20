import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal, MealType } from '../../interfaces/meal.interface';

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.scss']
})
export class MealDetailComponent {
  meal = input<Meal | null>(null);
  
  close = output<void>();
  edit = output<Meal>();
  duplicate = output<Meal>();

  getMealTypeIcon(mealType: MealType): string {
    switch (mealType) {
      case MealType.BREAKFAST: return '🌅';
      case MealType.LUNCH: return '☀️';
      case MealType.DINNER: return '🌙';
      case MealType.SNACK: return '🍪';
      default: return '🍽️';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getRecipeSteps(recipe: string): string[] {
    return recipe.split('\n').filter(step => step.trim().length > 0);
  }
}
