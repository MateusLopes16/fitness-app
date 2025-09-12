import { Component, OnInit, signal, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Meal, MealType } from '../../interfaces/meal.interface';
import { MealItem } from './meal-item/meal-item';
import { MealService } from '../../services/meal.service';

@Component({
  selector: 'app-meals-list',
  imports: [CommonModule, MealItem],
  templateUrl: './meals-list.html',
  styleUrls: ['./meals-list.scss', './meals-list.responsive.scss']
})
export class MealsList implements OnInit {
  meals = signal<Meal[]>([]);

  duplicateMeal = output<Meal>();
  deleteMeal = output<Meal>();
  loading = signal<boolean>(false);

  // Computed signals for better state management
  hasMeals = computed(() => this.meals().length > 0);
  showEmptyState = computed(() => !this.loading() && !this.hasMeals());

  constructor(private router: Router, private mealService: MealService,
  ) { }

  ngOnInit() {
    this.loadMeals();
  }

  loadMeals() {
    this.loading.set(true);
    // this.error.set('');

    this.mealService.getMeals().subscribe({
      next: (meals) => {
        this.meals.set(meals);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading meals:', error);
        // this.error.set('Failed to load meals');
        this.loading.set(false);
      }
    });
  }

  onAddNew(): void {
    this.router.navigate(['/nutrition/add-meal']);
  }

  onEdit(meal: Meal): void {
    if (meal.createdByType === 'admin') {
      return;
    }
    this.router.navigate(['/nutrition/edit-meal', meal.id]);
  }

  onView(meal: Meal): void {
    this.router.navigate(['/nutrition/meal', meal.id]);
  }

  onDelete(meal : Meal) {
    if (!meal) return;

    this.loading.set(true);
    // this.error.set('');

    this.mealService.deleteMeal(meal.id).subscribe({
      next: () => {
        this.meals.update(meals =>
          meals.filter(i => i.id !== meal.id)
        );
        this.loading.set(false);
        // this.onCloseDeleteForm();
      },
      error: (error) => {
        console.error('Error deleting ingredient:', error);
        // this.error.set('Failed to delete ingredient');
        this.loading.set(false);
      }
    });
  }
}

