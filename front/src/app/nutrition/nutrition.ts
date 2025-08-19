import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientService } from './services/ingredient.service';
import { MealService } from './services/meal.service';
import { Ingredient, CreateIngredientDto } from './interfaces/ingredient.interface';
import { Meal, CreateMealDto, DuplicateMealDto } from './interfaces/meal.interface';
import { IngredientsListComponent } from './components/ingredients-list/ingredients-list';
import { AddIngredientPopupComponent } from './components/add-ingredient-popup/add-ingredient-popup';
import { DeleteIngredientPopupComponent } from './components/delete-ingredient-popup/delete-ingredient-popup';
import { MealsListComponent } from './components/meals-list/meals-list';
import { MealDetailComponent } from './components/meal-detail/meal-detail';
import { MealFormComponent } from './components/meal-form/meal-form';
import { DuplicateMealPopupComponent } from './components/duplicate-meal-popup/duplicate-meal-popup';
import { DeleteMealPopupComponent } from './components/delete-meal-popup/delete-meal-popup';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [
    CommonModule, 
    IngredientsListComponent, 
    AddIngredientPopupComponent, 
    DeleteIngredientPopupComponent,
    MealsListComponent,
    MealDetailComponent,
    MealFormComponent,
    DuplicateMealPopupComponent,
    DeleteMealPopupComponent
  ],
  templateUrl: './nutrition.html',
  styleUrls: ['./nutrition.scss']
})
export class NutritionComponent implements OnInit {
  // Tab management
  activeTab = signal<'meals' | 'ingredients'>('meals');

  // Ingredients
  ingredients = signal<Ingredient[]>([]);
  showAddForm = signal<boolean>(false);
  showDeleteForm = signal<boolean>(false);
  editingIngredient = signal<Ingredient | null>(null);
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

  onAddIngredient() {
    this.editingIngredient.set(null);
    this.showAddForm.set(true);
  }

  onEditIngredient(ingredient: Ingredient) {
    this.editingIngredient.set(ingredient);
    this.showAddForm.set(true);
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

  onSaveIngredient(ingredientData: CreateIngredientDto) {
    this.loading.set(true);
    this.error.set('');

    const editingId = this.editingIngredient()?.id;
    
    if (editingId) {
      // Update existing ingredient
      this.ingredientService.updateIngredient(editingId, ingredientData).subscribe({
        next: (updatedIngredient) => {
          this.ingredients.update(ingredients => 
            ingredients.map(i => i.id === editingId ? updatedIngredient : i)
          );
          this.closePopup();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error updating ingredient:', error);
          console.error('Error details:', error.error);
          const errorMessage = error.error?.message ? 
            (Array.isArray(error.error.message) ? error.error.message.join(', ') : error.error.message) :
            'Failed to update ingredient';
          this.error.set(errorMessage);
          this.loading.set(false);
        }
      });
    } else {
      // Create new ingredient
      this.ingredientService.createIngredient(ingredientData).subscribe({
        next: (newIngredient) => {
          this.ingredients.update(ingredients => [...ingredients, newIngredient]);
          this.closePopup();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error creating ingredient:', error);
          console.error('Error details:', error.error);
          const errorMessage = error.error?.message ? 
            (Array.isArray(error.error.message) ? error.error.message.join(', ') : error.error.message) :
            'Failed to create ingredient';
          this.error.set(errorMessage);
          this.loading.set(false);
        }
      });
    }
  }

  closePopup() {
    this.showAddForm.set(false);
    this.editingIngredient.set(null);
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

  onAddMeal() {
    this.editingMeal.set(null);
    this.showMealForm.set(true);
  }

  onViewMeal(meal: Meal) {
    this.selectedMeal.set(meal);
    this.showMealDetail.set(true);
  }

  onEditMeal(meal: Meal) {
    this.editingMeal.set(meal);
    this.showMealForm.set(true);
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
