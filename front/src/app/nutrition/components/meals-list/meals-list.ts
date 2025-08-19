import { Component, OnInit, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal, MealType } from '../../interfaces/meal.interface';

@Component({
  selector: 'app-meals-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="meals-list-container">
      <div class="meals-header">
        <div class="title-section">
          <h2>🍽️ Your Meals</h2>
          <p>Your personal meals and daily nutrition</p>
        </div>
        <div class="action-buttons">
          <button class="btn-filter" 
                  [class.active]="filterType() === 'all'"
                  (click)="filterType.set('all')">
            All
          </button>
          <button class="btn-filter" 
                  [class.active]="filterType() === 'admin'"
                  (click)="filterType.set('admin')">
            Admin
          </button>
          <button class="btn-filter" 
                  [class.active]="filterType() === 'user'"
                  (click)="filterType.set('user')">
            Personal
          </button>
          <button class="btn-primary" (click)="addNewMeal.emit()">
            <span class="icon">➕</span>
            Add Meal
          </button>
        </div>
      </div>

      <div class="meals-grid" *ngIf="!loading(); else loadingTemplate">
        <div *ngIf="filteredMeals().length === 0" class="empty-state">
          <div class="empty-icon">🍽️</div>
          <h3>No meals found</h3>
          <p>Add your first meal to track your nutrition</p>
          <button class="btn-primary" (click)="addNewMeal.emit()">
            Add Meal
          </button>
        </div>

        <div *ngFor="let meal of filteredMeals()" 
             class="meal-card" 
             [class.admin]="meal.createdByType === 'admin'"
             [class.personal]="meal.createdByType === 'user'"
             [class.breakfast]="meal.mealType === 'BREAKFAST'"
             [class.lunch]="meal.mealType === 'LUNCH'"
             [class.dinner]="meal.mealType === 'DINNER'"
             [class.snack]="meal.mealType === 'SNACK'"
             (click)="viewMeal.emit(meal)">
          
          <div class="meal-header">
            <div class="meal-title">
              <h3>{{ meal.name }}</h3>
              <div class="meal-meta">
                <span class="meal-type" *ngIf="meal.mealType">
                  {{ getMealTypeIcon(meal.mealType) }} {{ meal.mealType }}
                </span>
                <span class="meal-date" *ngIf="meal.date">
                  📅 {{ formatDate(meal.date) }}
                </span>
                <span class="servings">
                  👥 {{ meal.servings }} serving{{ meal.servings > 1 ? 's' : '' }}
                </span>
              </div>
            </div>
            <div class="meal-badges">
              <span class="badge admin" *ngIf="meal.createdByType === 'admin'">👑 Admin</span>
              <span class="badge personal" *ngIf="meal.createdByType === 'user'">👤 Personal</span>
              <span class="badge breakfast" *ngIf="meal.mealType === 'BREAKFAST'">🌅 Breakfast</span>
              <span class="badge lunch" *ngIf="meal.mealType === 'LUNCH'">☀️ Lunch</span>
              <span class="badge dinner" *ngIf="meal.mealType === 'DINNER'">🌙 Dinner</span>
              <span class="badge snack" *ngIf="meal.mealType === 'SNACK'">🍪 Snack</span>
            </div>
          </div>

          <div class="meal-description" *ngIf="meal.description">
            <p>{{ meal.description }}</p>
          </div>

          <div class="nutrition-summary">
            <div class="macro-item">
              <span class="macro-value">{{ meal.totalCalories.toFixed(0) }}</span>
              <span class="macro-label">kcal</span>
            </div>
            <div class="macro-item">
              <span class="macro-value">{{ meal.totalProtein.toFixed(1) }}g</span>
              <span class="macro-label">Protein</span>
            </div>
            <div class="macro-item">
              <span class="macro-value">{{ meal.totalCarbs.toFixed(1) }}g</span>
              <span class="macro-label">Carbs</span>
            </div>
            <div class="macro-item">
              <span class="macro-value">{{ meal.totalFat.toFixed(1) }}g</span>
              <span class="macro-label">Fat</span>
            </div>
          </div>

          <div class="ingredients-preview">
            <span class="ingredients-count">
              🥕 {{ meal.ingredients.length }} ingredient{{ meal.ingredients.length > 1 ? 's' : '' }}
            </span>
            <div class="ingredients-list">
              <span *ngFor="let ing of meal.ingredients.slice(0, 3)" class="ingredient-name">
                {{ ing.ingredient.name }}{{ ing !== meal.ingredients.slice(0, 3)[meal.ingredients.slice(0, 3).length - 1] ? ',' : '' }}
              </span>
              <span *ngIf="meal.ingredients.length > 3" class="more-ingredients">
                +{{ meal.ingredients.length - 3 }} more...
              </span>
            </div>
          </div>

          <div class="meal-actions" (click)="$event.stopPropagation()">
            <button class="btn-action" 
                    title="Duplicate"
                    (click)="duplicateMeal.emit(meal)">
              📋
            </button>
            <button class="btn-action" 
                    title="Edit"
                    (click)="editMeal.emit(meal)"
                    *ngIf="meal.createdByType === 'user'">
              ✏️
            </button>
            <button class="btn-action delete" 
                    title="Delete"
                    (click)="deleteMeal.emit(meal)"
                    *ngIf="meal.createdByType === 'user'">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading meals...</p>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./meals-list.scss']
})
export class MealsListComponent implements OnInit {
  meals = input<Meal[]>([]);
  loading = input<boolean>(false);

  addNewMeal = output<void>();
  viewMeal = output<Meal>();
  editMeal = output<Meal>();
  duplicateMeal = output<Meal>();
  deleteMeal = output<Meal>();

  filterType = signal<'all' | 'admin' | 'user'>('all');
  filteredMeals = signal<Meal[]>([]);

  ngOnInit() {
    this.updateFilteredMeals();
  }

  ngOnChanges() {
    this.updateFilteredMeals();
  }

  private updateFilteredMeals() {
    const meals = this.meals();
    const filter = this.filterType();

    let filtered = meals;

    if (filter === 'admin') {
      filtered = meals.filter(meal => meal.createdByType === 'admin');
    } else if (filter === 'user') {
      filtered = meals.filter(meal => meal.createdByType === 'user');
    }

    this.filteredMeals.set(filtered);
  }

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
}
