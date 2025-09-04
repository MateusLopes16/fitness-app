import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Meal, MealType } from '../../../interfaces/meal.interface';
import { MealService } from '../../../services/meal.service';

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-detail.component.html',
    styleUrls: ['./meal-detail.component.scss']

})
export class MealDetailComponent implements OnInit {
  meal: Meal | null = null;
  loading = true;
  error: string | null = null;
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private mealService = inject(MealService);

  ngOnInit(): void {
    const mealId = this.route.snapshot.params['id'];
    if (mealId) {
      this.loadMeal(mealId);
    } else {
      this.error = 'No meal ID provided';
      this.loading = false;
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
