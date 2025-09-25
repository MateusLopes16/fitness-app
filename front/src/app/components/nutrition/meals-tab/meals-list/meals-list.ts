import { Component, OnInit, signal, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Meal, MealType } from '../../interfaces/meal.interface';
import { MealItem } from './meal-item/meal-item';
import { MealService } from '../../services/meal.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-meals-list',
  imports: [CommonModule, MealItem],
  templateUrl: './meals-list.html',
  styleUrls: ['./meals-list.scss', './meals-list.responsive.scss']
})
export class MealsList implements OnInit {
  meals = signal<Meal[]>([]);
  viewType = signal<string>('grid');

  duplicateMeal = output<Meal>();
  deleteMeal = output<Meal>();
  mealselected = output<Meal>();
  loading = signal<boolean>(false);

  // Search handling
  private searchSubject = new Subject<string>();
  mealSearch = signal<string>('');

  // Filter handling
  activeFilters = signal<Set<string>>(new Set());

  // Computed signals for better state management
  hasMeals = computed(() => {
    const meals = this.filteredMealsComputed();
    return meals && meals.length > 0;
  });
  showEmptyState = computed(() => !this.loading() && !this.hasMeals());

  // Filtered meals based on search term and meal type filters
  filteredMealsComputed = computed(() => {
    const search = this.mealSearch().toLowerCase();
    const filters = this.activeFilters();

    return this.meals().filter(meal => {
      // Search filter
      const matchesSearch = meal.name.toLowerCase().includes(search) ||
                          (meal.description && meal.description.toLowerCase().includes(search));

      // Meal type filter
      const matchesFilters = filters.size === 0 ||
        Array.from(filters).some(filter =>
          this.matchesMealType(meal, filter)
        );

      return matchesSearch && matchesFilters;
    });
  });

  constructor(private router: Router, private mealService: MealService,
  ) { 
    // Set up search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        this.loading.set(true);
        return this.mealService.getMeals();
      })
    ).subscribe({
      next: (meals) => {
        this.meals.set(meals || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading meals:', error);
        this.meals.set([]);
        this.loading.set(false);
      }
    });
  }

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

  onSelect(meal: Meal): void {
    this.mealselected.emit(meal);
  }

  onEdit(meal: Meal): void {
    if (meal.createdByType === 'admin') {
      return;
    }
    this.router.navigate(['/nutrition/edit-meal', meal.id]);
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
        console.error('Error deleting meal:', error);
        // this.error.set('Failed to delete meal');
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string) {
    this.mealSearch.set(value);
    this.searchSubject.next(value);
  }

  chooseView(value: string) {
    this.viewType.set(value);
  }

  // Method to toggle filters
  toggleFilter(filterType: string): void {
    const currentFilters = new Set(this.activeFilters());

    if (currentFilters.has(filterType)) {
      // If clicking on an active filter, reset all filters
      currentFilters.clear();
    } else {
      // If clicking on an inactive filter, set only this filter as active
      currentFilters.clear();
      currentFilters.add(filterType);
    }

    this.activeFilters.set(currentFilters);
  }

  // Helper method to check if meal matches a meal type filter
  private matchesMealType(meal: Meal, filterType: string): boolean {
    if (!meal.mealType) return false;
    
    const mealTypeValue = meal.mealType.toLowerCase();
    const filterTypeValue = filterType.toLowerCase();
    
    return mealTypeValue === filterTypeValue;
  }

  trackByMealId(index: number, meal: Meal): string {
    return meal.id;
  }
}

