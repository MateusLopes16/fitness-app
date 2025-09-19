import { Component, OnInit, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Meal, MealType } from '../../interfaces/meal.interface';
import { MealService } from '../../services/meal.service';
import { IngredientsList } from "../../ingredients-tab/ingredients-list/ingredients-list";

@Component({
  selector: 'app-meal-details',
  imports: [CommonModule, IngredientsList],
  templateUrl: './meal-details.html',
  styleUrl: './meal-details.scss'
})
export class MealDetails implements OnInit, OnChanges {
  @Input() meal: Meal | null = null; // For side panel mode
  @Input() isInSidePanel: boolean = false; // To hide navigation elements
  
  loading = true;
  error: string | null = null;
  showActions: boolean = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private mealService = inject(MealService);

  ngOnInit(): void {
    // If meal is provided via input (side panel mode), use it directly
    if (this.meal) {
      this.loading = false;
      return;
    }

    // Otherwise, load from route (full page mode)
    const mealId = this.route.snapshot.params['id'];
    if (mealId) {
      this.loadMeal(mealId);
    } else {
      this.error = 'No meal ID provided';
      this.loading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes to meal input (for side panel mode)
    if (changes['meal'] && changes['meal'].currentValue) {
      this.meal = changes['meal'].currentValue;
      this.loading = false;
      this.error = null;
    }
  }

  private loadMeal(id: string): void {
    this.loading = true;
    this.mealService.getMeal(id).subscribe({
      next: (meal) => {
        this.meal = meal;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load meal details';
        this.loading = false;
        console.error('Error loading meal:', error);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/nutrition']);
  }

  onEdit(): void {
    if (this.meal && this.meal.createdByType !== 'admin') {
      this.router.navigate(['/nutrition/edit-meal', this.meal.id]);
    }
  }

  onDuplicate(): void {
    if (this.meal) {
      // Navigate to add meal with meal data for duplication
      this.router.navigate(['/nutrition/add-meal'], {
        queryParams: { duplicate: this.meal.id }
      });
    }
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

  getRecipeSteps(recipe: string): string[] {
    return recipe.split('\n').filter(step => step.trim().length > 0);
  }
}

