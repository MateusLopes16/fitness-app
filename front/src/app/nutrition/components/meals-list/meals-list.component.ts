import { Component, OnInit, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Meal, MealType } from '../../interfaces/meal.interface';

@Component({
  selector: 'app-meals-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meals-list.component.html',
  styleUrls: ['./meals-list.component.scss']
})
export class MealsListComponent implements OnInit {
  meals = input<Meal[]>([]);
  loading = input<boolean>(false);

  viewMeal = output<Meal>();
  duplicateMeal = output<Meal>();
  deleteMeal = output<Meal>();

  filterType = signal<'all' | 'admin' | 'user'>('all');
  filteredMeals = signal<Meal[]>([]);

  constructor(private router: Router) {}

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

  onAddNew(): void {
    this.router.navigate(['/nutrition/add-meal']);
  }

  onEdit(meal: Meal): void {
    if (meal.createdByType === 'admin') {
      return;
    }
    this.router.navigate(['/nutrition/edit-meal', meal.id]);
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
