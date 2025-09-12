import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientService } from './services/ingredient.service';
import { MealService } from './services/meal.service';
import { Ingredient, CreateIngredientDto } from './interfaces/ingredient.interface';
import { Meal, CreateMealDto, DuplicateMealDto } from './interfaces/meal.interface';
import { IngredientsTab } from './ingredients-tab/ingredients-tab';
import { ActivatedRoute, Router } from '@angular/router';
// import { MealsListComponent } from './components/meals-list/meals-list.component';
// import { MealSchedulingComponent } from './meal-scheduling/meal-scheduling.component';

enum NutritionTabs {
  MEALS = "MEALS",
  INGREDIENTS = "INGREDIENTS",
  SCHEDULING = "SCHEDULING"
}

@Component({
  selector: 'app-nutrition',
  imports: [CommonModule, IngredientsTab],
  templateUrl: './nutrition.html',
  styleUrls: ['./nutrition.scss', './nutrition.responsive.scss']
})
export class Nutrition implements OnInit {
  // Expose enum to template
  NutritionTabs = NutritionTabs;

  // Tab management
  activeTab = signal<NutritionTabs>(NutritionTabs.MEALS);

  // Meals
  meals = signal<Meal[]>([]);
  editingMeal = signal<Meal | null>(null);
  duplicatingMeal = signal<Meal | null>(null);
  deletingMeal = signal<Meal | null>(null);

  showMealForm = signal<boolean>(false);
  showDuplicateForm = signal<boolean>(false);
  showDeleteMealForm = signal<boolean>(false);

  // Common
  loading = signal<boolean>(false);
  error = signal<string>('');

  private router = inject(Router);
  

  constructor(
    private ingredientService: IngredientService,
    private mealService: MealService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.loadMeals();

    // Check for activeTab in query parameters and clean URL
    const activeTabParam = this.route.snapshot.queryParamMap.get('activeTab');
    if (activeTabParam && Object.values(NutritionTabs).includes(activeTabParam as NutritionTabs)) {
      // Set the active tab based on URL parameter
      this.activeTab.set(activeTabParam as NutritionTabs);
      
      // Remove the query parameter from URL to keep it clean
      this.router.navigate(['/nutrition'], { replaceUrl: true });
    }
  }

  isActiveTab(tab: NutritionTabs): boolean {
    return this.activeTab() === tab;
  }

  setActiveTab(tab: NutritionTabs) {
    this.activeTab.set(tab);
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

  onDuplicateMeal(meal: Meal) {
    this.duplicatingMeal.set(meal);
    this.showDuplicateForm.set(true);
  }

  onDeleteMeal(meal: Meal) {
    this.deletingMeal.set(meal);
    this.showDeleteMealForm.set(true);
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
