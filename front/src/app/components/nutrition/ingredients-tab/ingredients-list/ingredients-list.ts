import { Component, OnInit, OnChanges, SimpleChanges, signal, computed } from '@angular/core';
import { IngredientItem } from './ingredient-item/ingredient-item';
import { Input, Output, EventEmitter } from '@angular/core';
import { Ingredient } from '../../interfaces/ingredient.interface';
import { IngredientTag } from '../../enums/ingredient-tag.enum';
import { Router } from '@angular/router';
import { IngredientService } from '../../services/ingredient.service';
import { CommonModule } from '@angular/common';
import { MealIngredient } from '../../interfaces/meal.interface';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

// Extended interface for ingredients with quantity information
export interface IngredientWithQuantity extends Ingredient {
  quantityGrams?: number;
}

@Component({
  selector: 'app-ingredients-list',
  imports: [IngredientItem, CommonModule],
  templateUrl: './ingredients-list.html',
  styleUrls: ['./ingredients-list.scss']
})
export class IngredientsList implements OnInit, OnChanges {
  @Input() showActions: boolean = true;
  @Input() filteredIngredients: MealIngredient[] | undefined;
  @Output() ingredientSelected = new EventEmitter<Ingredient>();

  ingredients = signal<IngredientWithQuantity[]>([]);
  loading = signal<boolean>(false);
  viewType = signal<string>('list');

  // Search handling
  private searchSubject = new Subject<string>();
  ingredientSearch = signal<string>('');

  // Computed signals for better state management
  hasIngredients = computed(() => {
    const ingredients = this.filteredIngredientsComputed();
    return ingredients && ingredients.length > 0;
  });
  showEmptyState = computed(() => !this.loading() && !this.hasIngredients());

  // Check if we're displaying meal ingredients (with quantities)
  isMealIngredientMode = computed(() => !!this.filteredIngredients);

  // Filtered ingredients based on search term (client-side filtering for loaded items)
  filteredIngredientsComputed = computed(() => {
    const search = this.ingredientSearch().toLowerCase();
    const filters = this.activeFilters();

    return this.ingredients().filter(ingredient => {
      // Search filter
      const matchesSearch = ingredient.name.toLowerCase().includes(search);

      // Tag filter
      const matchesFilters = filters.size === 0 ||
        Array.from(filters).some(filter =>
          this.matchesIngredientTag(ingredient, filter)
        );

      return matchesSearch && matchesFilters;
    });
  });

  constructor(private router: Router, private ingredientService: IngredientService) {
    // Set up search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        this.ingredients.set([]);
        this.loading.set(true);
        return this.ingredientService.getIngredients(searchTerm);
      })
    ).subscribe({
      next: (ingredients) => {
        this.ingredients.set(ingredients || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
        this.ingredients.set([]);
        this.loading.set(false);
      }
    });
  }

  /**
   * Transform MealIngredient to IngredientWithQuantity, preserving quantityGrams
   */
  private transformMealIngredientToIngredient(mealIngredient: MealIngredient): IngredientWithQuantity {
    return {
      ...mealIngredient.ingredient,
      quantityGrams: mealIngredient.quantityGrams,
      createdAt: new Date(), // Default values for required fields
      createdByType: 'user' as const
    };
  }

  /**
   * Transform array of MealIngredients to IngredientWithQuantity
   */
  private transformMealIngredientsToIngredients(mealIngredients: MealIngredient[]): IngredientWithQuantity[] {
    return mealIngredients.map(mealIngredient => this.transformMealIngredientToIngredient(mealIngredient));
  }

  /**
   * Get the display quantity for an ingredient (either from quantityGrams or default 100)
   */
  getDisplayQuantity(ingredient: IngredientWithQuantity): number {
    return ingredient.quantityGrams || 100;
  }

  ngOnInit() {
    // Only load ingredients if no filteredIngredients are provided initially
    if (!this.filteredIngredients) {
      this.loadIngredients();
    } else {
      // Set initial filtered ingredients using transformation
      this.ingredients.set(this.transformMealIngredientsToIngredients(this.filteredIngredients));
    }
  }

  private loadIngredientsInternal(searchTerm?: string) {
    this.loading.set(true);
    this.ingredientService.getIngredients(searchTerm).subscribe({
      next: (ingredients) => {
        console.log('Ingredients loaded:', ingredients);
        this.ingredients.set(ingredients || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
        this.ingredients.set([]);
        this.loading.set(false);
      }
    });
  }

  loadIngredients() {
    this.loadIngredientsInternal();
  }

  onSearchChange(value: string) {
    this.ingredientSearch.set(value);
    this.searchSubject.next(value);
  }

  ngOnChanges(changes: SimpleChanges) {
    // React to changes in filteredIngredients
    if (changes['filteredIngredients'] && this.filteredIngredients) {
      this.ingredients.set(this.transformMealIngredientsToIngredients(this.filteredIngredients));
    }
  }

  onAddNew(): void {
    this.router.navigate(['/nutrition/add-ingredient']);
  }

  trackByIngredientId(index: number, ingredient: IngredientWithQuantity): string {
    return ingredient.id;
  }

  onDelete(ingredient: IngredientWithQuantity) {
    if (!ingredient) return;

    this.loading.set(true);
    // this.error.set('');

    this.ingredientService.deleteIngredient(ingredient.id).subscribe({
      next: () => {
        this.ingredients.update(ingredients =>
          ingredients.filter(i => i.id !== ingredient.id)
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

  onIngredientSelected(ingredient: IngredientWithQuantity) {
    // Convert back to regular Ingredient when emitting
    const baseIngredient: Ingredient = {
      id: ingredient.id,
      name: ingredient.name,
      tag: ingredient.tag,
      caloriesPer100g: ingredient.caloriesPer100g,
      proteinPer100g: ingredient.proteinPer100g,
      carbsPer100g: ingredient.carbsPer100g,
      fatPer100g: ingredient.fatPer100g,
      fiberPer100g: ingredient.fiberPer100g,
      sugarPer100g: ingredient.sugarPer100g,
      sodiumPer100g: ingredient.sodiumPer100g,
      createdBy: ingredient.createdBy,
      createdByType: ingredient.createdByType,
      createdAt: ingredient.createdAt
    };
    this.ingredientSelected.emit(baseIngredient);
  }

  chooseView(value: string) {
    this.viewType.set(value);
  }

  activeFilters = signal<Set<string>>(new Set());

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

  // Helper method to check if ingredient matches a tag filter
  private matchesIngredientTag(ingredient: IngredientWithQuantity, filterTag: string): boolean {
    // Only match ingredients with the exact tag enum value
    const ingredientTagValue = ingredient.tag;
    const filterTagUpper = filterTag.toUpperCase();
    
    // Direct tag match using enum values - this is the ONLY criteria
    return ingredientTagValue === filterTagUpper || 
           ingredientTagValue === IngredientTag[filterTagUpper as keyof typeof IngredientTag];
  }

}
