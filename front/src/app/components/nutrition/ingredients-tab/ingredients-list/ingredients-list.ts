import { Component, OnInit, OnChanges, SimpleChanges, signal, computed } from '@angular/core';
import { IngredientItem } from './ingredient-item/ingredient-item';
import { Input, Output, EventEmitter } from '@angular/core';
import { Ingredient } from '../../interfaces/ingredient.interface';
import { Router } from '@angular/router';
import { IngredientService } from '../../services/ingredient.service';
import { CommonModule } from '@angular/common';
import { MealIngredient } from '../../interfaces/meal.interface';

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

  // Computed signals for better state management
  hasIngredients = computed(() => this.ingredients().length > 0);
  showEmptyState = computed(() => !this.loading() && !this.hasIngredients());
  
  // Check if we're displaying meal ingredients (with quantities)
  isMealIngredientMode = computed(() => !!this.filteredIngredients);

  constructor(private router: Router, private ingredientService: IngredientService,
  ) { }

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

  loadIngredients() {
    console.log('Loading ingredients...');
    this.loading.set(true);
    this.ingredients.set([]); // Clear existing data while loading

    this.ingredientService.getIngredients().subscribe({
      next: (ingredients) => {
        console.log('Ingredients loaded:', ingredients);
        this.ingredients.set(ingredients || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
        this.ingredients.set([]); // Ensure empty array on error
        // this.error.set('Failed to load ingredients');
        this.loading.set(false);
      }
    });
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

}
