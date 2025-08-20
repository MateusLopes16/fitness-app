import { Component, OnInit, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meal, MealType, CreateMealDto, CreateMealIngredientDto } from '../../interfaces/meal.interface';
import { Ingredient } from '../../interfaces/ingredient.interface';
import { IngredientService } from '../../services/ingredient.service';

@Component({
  selector: 'app-meal-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-form.component.html',
  styleUrls: ['./meal-form.component.scss']
})
export class MealFormComponent implements OnInit {
  editingMeal = input<Meal | null>(null);
  loading = input<boolean>(false);

  close = output<void>();
  save = output<CreateMealDto>();

  // Form data
  formData: CreateMealDto = {
    name: '',
    description: '',
    recipe: '',
    mealType: undefined,
    date: '',
    servings: 1,
    ingredients: []
  };

  // Ingredient selection
  showIngredientSelector = false;
  ingredientSearch = '';
  availableIngredients = signal<Ingredient[]>([]);
  filteredIngredients = signal<Ingredient[]>([]);

  constructor(private ingredientService: IngredientService) {}

  ngOnInit() {
    this.loadIngredients();
    this.initializeForm();
  }

  ngOnChanges() {
    this.initializeForm();
  }

  private initializeForm() {
    const meal = this.editingMeal();
    if (meal) {
      this.formData = {
        name: meal.name,
        description: meal.description || '',
        recipe: meal.recipe || '',
        mealType: meal.mealType,
        date: meal.date || '',
        servings: meal.servings,
        ingredients: meal.ingredients.map(ing => ({
          ingredientId: ing.ingredientId,
          quantityGrams: ing.quantityGrams.toString()
        }))
      };
    } else {
      this.resetForm();
    }
  }

  private resetForm() {
    this.formData = {
      name: '',
      description: '',
      recipe: '',
      mealType: undefined,
      date: '',
      servings: 1,
      ingredients: []
    };
  }

  private loadIngredients() {
    this.ingredientService.getIngredients().subscribe({
      next: (ingredients) => {
        this.availableIngredients.set(ingredients);
        // Show only first 10 ingredients initially to avoid overwhelming the user
        this.filteredIngredients.set(ingredients.slice(0, 10));
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
      }
    });
  }

  filterIngredients() {
    const search = this.ingredientSearch.toLowerCase().trim();
    
    if (search.length > 0) {
      // Use backend search for better results
      this.ingredientService.getIngredients(search).subscribe({
        next: (ingredients) => {
          this.filteredIngredients.set(ingredients);
        },
        error: (error) => {
          console.error('Error searching ingredients:', error);
          // Fallback to local filtering
          const filtered = this.availableIngredients().filter(ingredient =>
            ingredient.name.toLowerCase().includes(search) ||
            (ingredient.brand && ingredient.brand.toLowerCase().includes(search))
          );
          this.filteredIngredients.set(filtered);
        }
      });
    } else {
      // Show all available ingredients when no search
      this.filteredIngredients.set(this.availableIngredients().slice(0, 10));
    }
  }

  selectIngredient(ingredient: Ingredient) {
    // Check if ingredient is already added
    const exists = this.formData.ingredients.some(ing => ing.ingredientId === ingredient.id);
    if (exists) {
      return;
    }

    this.formData.ingredients.push({
      ingredientId: ingredient.id,
      quantityGrams: '100'
    });

    this.showIngredientSelector = false;
    this.ingredientSearch = '';
  }

  removeIngredient(index: number) {
    this.formData.ingredients.splice(index, 1);
  }

  getIngredientName(ingredientId: string): string {
    const ingredient = this.availableIngredients().find(ing => ing.id === ingredientId);
    return ingredient ? `${ingredient.name}${ingredient.brand ? ` (${ingredient.brand})` : ''}` : 'Unknown ingredient';
  }

  calculateIngredientCalories(mealIngredient: CreateMealIngredientDto): number {
    const ingredient = this.availableIngredients().find(ing => ing.id === mealIngredient.ingredientId);
    if (!ingredient) return 0;
    
    const quantity = parseFloat(mealIngredient.quantityGrams) || 0;
    return (ingredient.caloriesPer100g * quantity) / 100;
  }

  getTotalCalories(): number {
    return this.formData.ingredients.reduce((total, mealIngredient) => {
      return total + this.calculateIngredientCalories(mealIngredient);
    }, 0);
  }

  getTotalProtein(): number {
    return this.formData.ingredients.reduce((total, mealIngredient) => {
      const ingredient = this.availableIngredients().find(ing => ing.id === mealIngredient.ingredientId);
      if (!ingredient) return total;
      
      const quantity = parseFloat(mealIngredient.quantityGrams) || 0;
      return total + (ingredient.proteinPer100g * quantity) / 100;
    }, 0);
  }

  getTotalCarbs(): number {
    return this.formData.ingredients.reduce((total, mealIngredient) => {
      const ingredient = this.availableIngredients().find(ing => ing.id === mealIngredient.ingredientId);
      if (!ingredient) return total;
      
      const quantity = parseFloat(mealIngredient.quantityGrams) || 0;
      return total + (ingredient.carbsPer100g * quantity) / 100;
    }, 0);
  }

  getTotalFat(): number {
    return this.formData.ingredients.reduce((total, mealIngredient) => {
      const ingredient = this.availableIngredients().find(ing => ing.id === mealIngredient.ingredientId);
      if (!ingredient) return total;
      
      const quantity = parseFloat(mealIngredient.quantityGrams) || 0;
      return total + (ingredient.fatPer100g * quantity) / 100;
    }, 0);
  }

  onSubmit() {
    if (this.formData.ingredients.length === 0) {
      return;
    }

    this.save.emit(this.formData);
  }
}
