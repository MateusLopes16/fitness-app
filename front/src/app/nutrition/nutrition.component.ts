import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientService } from './services/ingredient.service';
import { MealService } from './services/meal.service';
import { Ingredient, CreateIngredientDto } from './interfaces/ingredient.interface';
import { Meal, CreateMealDto, DuplicateMealDto } from './interfaces/meal.interface';
import { IngredientsListComponent } from './components/ingredients-list/ingredients-list.component';
import { DeleteIngredientPopupComponent } from './components/delete-ingredient-popup/delete-ingredient-popup.component';
import { MealsListComponent } from './components/meals-list/meals-list.component';
import { MealDetailComponent } from './components/meal-detail/meal-detail.component';
import { MealFormComponent } from './components/meal-form/meal-form.component';
import { DuplicateMealPopupComponent } from './components/duplicate-meal-popup/duplicate-meal-popup.component';
import { DeleteMealPopupComponent } from './components/delete-meal-popup/delete-meal-popup.component';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [
    CommonModule, 
    IngredientsListComponent, 
    DeleteIngredientPopupComponent,
    MealsListComponent,
    MealDetailComponent,
    MealFormComponent,
    DuplicateMealPopupComponent,
    DeleteMealPopupComponent
  ],
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent implements OnInit {
  // Tab management
  activeTab = signal<'meals' | 'ingredients'>('meals');

  // Ingredients
  ingredients = signal<Ingredient[]>([]);
  showDeleteForm = signal<boolean>(false);
  deletingIngredient = signal<Ingredient | null>(null);

  // Meals
  meals = signal<Meal[]>([]);
  selectedMeal = signal<Meal | null>(null);
  editingMeal = signal<Meal | null>(null);
  duplicatingMeal = signal<Meal | null>(null);
  deletingMeal = signal<Meal | null>(null);
  
  showMealDetail = signal<boolean>(false);
  showMealForm = signal<boolean>(false);
  showDuplicateForm = signal<boolean>(false);
  showDeleteMealForm = signal<boolean>(false);

  // Common
  loading = signal<boolean>(false);
  error = signal<string>('');

  constructor(
    private ingredientService: IngredientService,
    private mealService: MealService
  ) {}

  ngOnInit() {
    this.loadIngredients();
    this.loadMeals();
  }

  loadIngredients() {
    this.loading.set(true);
    this.error.set('');
    
    this.ingredientService.getIngredients().subscribe({
      next: (ingredients) => {
        this.ingredients.set(ingredients);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
        this.error.set('Failed to load ingredients');
        this.loading.set(false);
      }
    });
  }

  onDeleteIngredient(ingredient: Ingredient) {
    this.deletingIngredient.set(ingredient);
    this.showDeleteForm.set(true);
  }

  onCloseDeleteForm() {
    this.showDeleteForm.set(false);
    this.deletingIngredient.set(null);
  }

  onConfirmDelete() {
    const ingredient = this.deletingIngredient();
    if (!ingredient) return;

    this.loading.set(true);
    this.error.set('');

    this.ingredientService.deleteIngredient(ingredient.id).subscribe({
      next: () => {
        this.ingredients.update(ingredients => 
          ingredients.filter(i => i.id !== ingredient.id)
        );
        this.loading.set(false);
        this.onCloseDeleteForm();
      },
      error: (error) => {
        console.error('Error deleting ingredient:', error);
        this.error.set('Failed to delete ingredient');
        this.loading.set(false);
      }
    });
  }

  trackByIngredientId(index: number, ingredient: Ingredient): string {
    return ingredient.id;
  }

  // Meal methods
  loadMeals() {
    this.loading.set(true);
    this.error.set('');
    
    this.mealService.getMeals().subscribe({
      next: (meals) => {
        this.meals.set(meals);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading meals:', error);
        this.error.set('Failed to load meals');
        this.loading.set(false);
      }
    });
  }

  onViewMeal(meal: Meal) {
    this.selectedMeal.set(meal);
    this.showMealDetail.set(true);
  }

  onDuplicateMeal(meal: Meal) {
    this.duplicatingMeal.set(meal);
    this.showDuplicateForm.set(true);
  }

  onDeleteMeal(meal: Meal) {
    this.deletingMeal.set(meal);
    this.showDeleteMealForm.set(true);
  }

  closeMealDetail() {
    this.showMealDetail.set(false);
    this.selectedMeal.set(null);
  }

  closeMealForm() {
    this.showMealForm.set(false);
    this.editingMeal.set(null);
  }

  closeDuplicateForm() {
    this.showDuplicateForm.set(false);
    this.duplicatingMeal.set(null);
  }

  closeDeleteMealForm() {
    this.showDeleteMealForm.set(false);
    this.deletingMeal.set(null);
  }

  onSaveMeal(mealData: CreateMealDto) {
    this.loading.set(true);
    this.error.set('');

    const editingId = this.editingMeal()?.id;
    
    if (editingId) {
      // Update existing meal
      this.mealService.updateMeal(editingId, mealData).subscribe({
        next: (updatedMeal) => {
          // Update in meals list
          this.meals.update(meals => 
            meals.map(m => m.id === editingId ? updatedMeal : m)
          );
          this.closeMealForm();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error updating meal:', error);
          this.error.set('Failed to update meal');
          this.loading.set(false);
        }
      });
    } else {
      // Create new meal
      this.mealService.createMeal(mealData).subscribe({
        next: (newMeal) => {
          // Add to meals list
          this.meals.update(meals => [...meals, newMeal]);
          this.closeMealForm();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error creating meal:', error);
          this.error.set('Failed to create meal');
          this.loading.set(false);
        }
      });
    }
  }

  onConfirmDuplicate(duplicateData: DuplicateMealDto) {
    const meal = this.duplicatingMeal();
    if (!meal) return;

    this.loading.set(true);
    this.error.set('');

    this.mealService.duplicateMeal(meal.id, duplicateData).subscribe({
      next: (newMeal) => {
        this.meals.update(meals => [...meals, newMeal]);
        this.closeDuplicateForm();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error duplicating meal:', error);
        this.error.set('Failed to duplicate meal');
        this.loading.set(false);
      }
    });
  }

  onConfirmDeleteMeal() {
    const meal = this.deletingMeal();
    if (!meal) return;

    this.loading.set(true);
    this.error.set('');

    this.mealService.deleteMeal(meal.id).subscribe({
      next: () => {
        // Remove from meals list
        this.meals.update(meals => 
          meals.filter(m => m.id !== meal.id)
        );
        this.closeDeleteMealForm();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error deleting meal:', error);
        this.error.set('Failed to delete meal');
        this.loading.set(false);
      }
    });
  }
}
