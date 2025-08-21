import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MealService } from '../services/meal.service';
import { IngredientService } from '../services/ingredient.service';
import { Meal, CreateMealDto, MealType } from '../interfaces/meal.interface';
import { Ingredient } from '../interfaces/ingredient.interface';

@Component({
  selector: 'app-add-meal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent implements OnInit {
  loading = signal<boolean>(false);
  error = signal<string>('');
  isEditing = signal<boolean>(false);
  mealId = signal<string | null>(null);
  ingredients = signal<Ingredient[]>([]);
  showIngredientSelector = signal<boolean>(false);
  ingredientSearch = signal<string>('');

  formData = signal<CreateMealDto>({
    name: '',
    description: '',
    mealType: MealType.BREAKFAST,
    servings: 1,
    date: new Date().toISOString().split('T')[0],
    ingredients: []
  });

  mealTypes = [
    { value: MealType.BREAKFAST, label: 'Breakfast', icon: '🌅' },
    { value: MealType.LUNCH, label: 'Lunch', icon: '☀️' },
    { value: MealType.DINNER, label: 'Dinner', icon: '🌙' },
    { value: MealType.SNACK, label: 'Snack', icon: '🍪' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mealService: MealService,
    private ingredientService: IngredientService
  ) {}

  ngOnInit() {
    this.loadIngredients();
    
    // Check if we're editing an existing meal
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mealId.set(id);
      this.isEditing.set(true);
      this.loadMeal(id);
    }
  }

  loadIngredients() {
    this.ingredientService.getIngredients().subscribe({
      next: (ingredients) => {
        this.ingredients.set(ingredients);
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
      }
    });
  }

  loadMeal(id: string) {
    this.loading.set(true);
    this.mealService.getMeal(id).subscribe({
      next: (meal) => {
        this.formData.set({
          name: meal.name,
          description: meal.description || '',
          mealType: meal.mealType,
          servings: meal.servings,
          date: meal.date ? new Date(meal.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          ingredients: meal.ingredients.map(ing => ({
            ingredientId: ing.ingredient.id,
            quantityGrams: ing.quantityGrams.toString()
          }))
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading meal:', error);
        this.error.set('Failed to load meal');
        this.loading.set(false);
      }
    });
  }

  updateFormData(field: keyof CreateMealDto, value: any) {
    this.formData.update(current => ({
      ...current,
      [field]: value
    }));
  }

  get filteredIngredients() {
    const search = this.ingredientSearch().toLowerCase();
    if (!search) return this.ingredients();
    
    return this.ingredients().filter(ingredient =>
      ingredient.name.toLowerCase().includes(search) ||
      (ingredient.brand && ingredient.brand.toLowerCase().includes(search))
    );
  }

  selectIngredient(ingredient: Ingredient) {
    const currentIngredients = this.formData().ingredients;
    
    // Check if ingredient is already added
    const exists = currentIngredients.some(ing => ing.ingredientId === ingredient.id);
    if (exists) {
      return;
    }

    this.formData.update(current => ({
      ...current,
      ingredients: [...current.ingredients, {
        ingredientId: ingredient.id,
        quantityGrams: '100'
      }]
    }));

    this.showIngredientSelector.set(false);
    this.ingredientSearch.set('');
  }

  removeIngredient(index: number) {
    this.formData.update(current => ({
      ...current,
      ingredients: current.ingredients.filter((_, i) => i !== index)
    }));
  }

  updateIngredientQuantity(index: number, quantity: string) {
    this.formData.update(current => ({
      ...current,
      ingredients: current.ingredients.map((ing, i) => 
        i === index ? { ...ing, quantityGrams: quantity } : ing
      )
    }));
  }

  getIngredientName(ingredientId: string): string {
    const ingredient = this.ingredients().find(ing => ing.id === ingredientId);
    return ingredient ? ingredient.name : 'Unknown ingredient';
  }

  calculateIngredientCalories(ingredient: { ingredientId: string; quantityGrams: string }): number {
    const ing = this.ingredients().find(i => i.id === ingredient.ingredientId);
    if (!ing) return 0;
    
    const quantity = parseFloat(ingredient.quantityGrams) || 0;
    return (ing.caloriesPer100g * quantity) / 100;
  }

  getTotalCalories(): number {
    return this.formData().ingredients.reduce((total, ingredient) => {
      return total + this.calculateIngredientCalories(ingredient);
    }, 0);
  }

  getTotalProtein(): number {
    return this.formData().ingredients.reduce((total, ingredient) => {
      const ing = this.ingredients().find(i => i.id === ingredient.ingredientId);
      if (!ing) return total;
      
      const quantity = parseFloat(ingredient.quantityGrams) || 0;
      return total + (ing.proteinPer100g * quantity) / 100;
    }, 0);
  }

  getTotalCarbs(): number {
    return this.formData().ingredients.reduce((total, ingredient) => {
      const ing = this.ingredients().find(i => i.id === ingredient.ingredientId);
      if (!ing) return total;
      
      const quantity = parseFloat(ingredient.quantityGrams) || 0;
      return total + (ing.carbsPer100g * quantity) / 100;
    }, 0);
  }

  getTotalFat(): number {
    return this.formData().ingredients.reduce((total, ingredient) => {
      const ing = this.ingredients().find(i => i.id === ingredient.ingredientId);
      if (!ing) return total;
      
      const quantity = parseFloat(ingredient.quantityGrams) || 0;
      return total + (ing.fatPer100g * quantity) / 100;
    }, 0);
  }

  onCancel() {
    this.router.navigate(['/nutrition']);
  }

  onSave() {
    if (!this.isFormValid()) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const mealData = {
      ...this.formData(),
      ingredients: this.formData().ingredients.map(ing => ({
        ingredientId: ing.ingredientId,
        quantityGrams: ing.quantityGrams
      }))
    };

    const request = this.isEditing() 
      ? this.mealService.updateMeal(this.mealId()!, mealData)
      : this.mealService.createMeal(mealData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/nutrition']);
      },
      error: (error) => {
        console.error('Error saving meal:', error);
        const errorMessage = error.error?.message ? 
          (Array.isArray(error.error.message) ? error.error.message.join(', ') : error.error.message) :
          `Failed to ${this.isEditing() ? 'update' : 'create'} meal`;
        this.error.set(errorMessage);
        this.loading.set(false);
      }
    });
  }

  isFormValid(): boolean {
    const data = this.formData();
    return !!(
      data.name?.trim() &&
      data.servings && data.servings > 0 &&
      data.ingredients.length > 0 &&
      data.ingredients.every(ing => 
        ing.quantityGrams && parseFloat(ing.quantityGrams) > 0
      )
    );
  }
}
