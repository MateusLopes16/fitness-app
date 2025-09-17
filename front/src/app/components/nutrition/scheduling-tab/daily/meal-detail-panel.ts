import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal, MealType } from '../../interfaces/meal.interface';

@Component({
  selector: 'app-meal-detail-panel',
  imports: [CommonModule],
  template: `
    <div class="meal-detail-panel" *ngIf="meal">
      
      <!-- Meal Header -->
      <div class="meal-header">
        <div class="meal-title">
          <h3>{{ meal.name }}</h3>
          <span class="meal-type-badge" [class]="meal.mealType?.toLowerCase()">
            {{ getMealTypeIcon(meal.mealType) }} {{ meal.mealType }}
          </span>
        </div>
        <div class="meal-servings">
          👥 {{ meal.servings }} serving{{ meal.servings > 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Nutrition Summary -->
      <div class="nutrition-summary">
        <h4>Nutrition Facts</h4>
        <div class="nutrition-grid">
          <div class="nutrition-item calories">
            <span class="value">{{ meal.totalCalories.toFixed(0) }}</span>
            <span class="unit">cal</span>
          </div>
          <div class="nutrition-item protein">
            <span class="value">{{ meal.totalProtein.toFixed(1) }}</span>
            <span class="unit">g protein</span>
          </div>
          <div class="nutrition-item carbs">
            <span class="value">{{ meal.totalCarbs.toFixed(1) }}</span>
            <span class="unit">g carbs</span>
          </div>
          <div class="nutrition-item fat">
            <span class="value">{{ meal.totalFat.toFixed(1) }}</span>
            <span class="unit">g fat</span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="meal-description" *ngIf="meal.description">
        <h4>Description</h4>
        <p>{{ meal.description }}</p>
      </div>

      <!-- Ingredients -->
      <div class="meal-ingredients">
        <h4>Ingredients ({{ meal.ingredients.length }})</h4>
        <div class="ingredients-list">
          <div 
            class="ingredient-item" 
            *ngFor="let mealIngredient of meal.ingredients">
            <div class="ingredient-info">
              <span class="ingredient-name">{{ mealIngredient.ingredient.name }}</span>
              <span class="ingredient-brand" *ngIf="mealIngredient.ingredient.brand">
                {{ mealIngredient.ingredient.brand }}
              </span>
            </div>
            <div class="ingredient-quantity">
              {{ mealIngredient.quantityGrams }}g
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe -->
      <div class="meal-recipe" *ngIf="meal.recipe">
        <h4>Recipe</h4>
        <div class="recipe-steps">
          <div 
            class="recipe-step" 
            *ngFor="let step of getRecipeSteps(meal.recipe); let i = index">
            <span class="step-number">{{ i + 1 }}.</span>
            <span class="step-text">{{ step }}</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .meal-detail-panel {
      padding: 1rem;
      height: 100%;
      overflow-y: auto;
    }

    .meal-header {
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
    }

    .meal-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .meal-title h3 {
      margin: 0;
      color: var(--text-color);
    }

    .meal-type-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .meal-type-badge.breakfast { background: var(--warning-light); color: var(--warning-dark); }
    .meal-type-badge.lunch { background: var(--info-light); color: var(--info-dark); }
    .meal-type-badge.dinner { background: var(--primary-light); color: var(--primary-dark); }
    .meal-type-badge.snack { background: var(--success-light); color: var(--success-dark); }

    .meal-servings {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .nutrition-summary {
      margin-bottom: 1.5rem;
    }

    .nutrition-summary h4 {
      margin: 0 0 0.75rem 0;
      color: var(--text-color);
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .nutrition-item {
      background: var(--card-background);
      padding: 0.75rem;
      border-radius: 8px;
      text-align: center;
    }

    .nutrition-item .value {
      display: block;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .nutrition-item .unit {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .nutrition-item.calories { border-left: 3px solid var(--primary-color); }
    .nutrition-item.protein { border-left: 3px solid var(--success-color); }
    .nutrition-item.carbs { border-left: 3px solid var(--warning-color); }
    .nutrition-item.fat { border-left: 3px solid var(--info-color); }

    .meal-description,
    .meal-ingredients,
    .meal-recipe {
      margin-bottom: 1.5rem;
    }

    .meal-description h4,
    .meal-ingredients h4,
    .meal-recipe h4 {
      margin: 0 0 0.75rem 0;
      color: var(--text-color);
    }

    .meal-description p {
      color: var(--text-muted);
      line-height: 1.5;
    }

    .ingredients-list {
      background: var(--card-background);
      border-radius: 8px;
      overflow: hidden;
    }

    .ingredient-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border-bottom: 1px solid var(--border-color);
    }

    .ingredient-item:last-child {
      border-bottom: none;
    }

    .ingredient-info {
      display: flex;
      flex-direction: column;
    }

    .ingredient-name {
      font-weight: 500;
      color: var(--text-color);
    }

    .ingredient-brand {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .ingredient-quantity {
      font-weight: 500;
      color: var(--primary-color);
    }

    .recipe-steps {
      background: var(--card-background);
      border-radius: 8px;
      padding: 1rem;
    }

    .recipe-step {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .recipe-step:last-child {
      margin-bottom: 0;
    }

    .step-number {
      color: var(--primary-color);
      font-weight: 600;
      min-width: 1.5rem;
    }

    .step-text {
      color: var(--text-color);
      line-height: 1.5;
    }
  `]
})
export class MealDetailPanel {
  @Input() meal: Meal | null = null;

  getMealTypeIcon(mealType?: MealType): string {
    if (!mealType) return '🍽️';
    switch (mealType) {
      case MealType.BREAKFAST: return '🌅';
      case MealType.LUNCH: return '☀️';
      case MealType.DINNER: return '🌙';
      case MealType.SNACK: return '🍪';
      default: return '🍽️';
    }
  }

  getRecipeSteps(recipe: string): string[] {
    return recipe.split('\n').filter(step => step.trim().length > 0);
  }
}