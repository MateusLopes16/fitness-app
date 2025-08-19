import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientService } from './services/ingredient.service';
import { Ingredient, CreateIngredientDto } from './interfaces/ingredient.interface';
import { IngredientsListComponent } from './components/ingredients-list/ingredients-list';
import { AddIngredientPopupComponent } from './components/add-ingredient-popup/add-ingredient-popup';
import { DeleteIngredientPopupComponent } from './components/delete-ingredient-popup/delete-ingredient-popup';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [CommonModule, IngredientsListComponent, AddIngredientPopupComponent, DeleteIngredientPopupComponent],
  templateUrl: './nutrition.html',
  styleUrls: ['./nutrition.scss']
})
export class NutritionComponent implements OnInit {
  ingredients = signal<Ingredient[]>([]);
  loading = signal<boolean>(false);
  showAddForm = signal<boolean>(false);
  showDeleteForm = signal<boolean>(false);
  editingIngredient = signal<Ingredient | null>(null);
  deletingIngredient = signal<Ingredient | null>(null);
  error = signal<string>('');

  constructor(private ingredientService: IngredientService) {}

  ngOnInit() {
    this.loadIngredients();
  }

  loadIngredients() {
    this.loading.set(true);
    this.error.set('');
    
    this.ingredientService.getIngredients().subscribe({
      next: (ingredients) => {
        this.ingredients.set(ingredients);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
        this.error.set('Failed to load ingredients');
        this.loading.set(false);
      }
    });
  }

  onAddIngredient() {
    this.editingIngredient.set(null);
    this.showAddForm.set(true);
  }

  onEditIngredient(ingredient: Ingredient) {
    this.editingIngredient.set(ingredient);
    this.showAddForm.set(true);
  }

  onDeleteIngredient(ingredient: Ingredient) {
    this.deletingIngredient.set(ingredient);
    this.showDeleteForm.set(true);
  }

  onCloseDeleteForm() {
    this.showDeleteForm.set(false);
    this.deletingIngredient.set(null);
  }

  onConfirmDelete() {
    const ingredient = this.deletingIngredient();
    if (!ingredient) return;

    this.loading.set(true);
    this.error.set('');

    this.ingredientService.deleteIngredient(ingredient.id).subscribe({
      next: () => {
        this.ingredients.update(ingredients => 
          ingredients.filter(i => i.id !== ingredient.id)
        );
        this.loading.set(false);
        this.onCloseDeleteForm();
      },
      error: (error) => {
        console.error('Error deleting ingredient:', error);
        this.error.set('Failed to delete ingredient');
        this.loading.set(false);
      }
    });
  }

  onSaveIngredient(ingredientData: CreateIngredientDto) {
    this.loading.set(true);
    this.error.set('');

    const editingId = this.editingIngredient()?.id;
    
    if (editingId) {
      // Update existing ingredient
      this.ingredientService.updateIngredient(editingId, ingredientData).subscribe({
        next: (updatedIngredient) => {
          this.ingredients.update(ingredients => 
            ingredients.map(i => i.id === editingId ? updatedIngredient : i)
          );
          this.closePopup();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error updating ingredient:', error);
          console.error('Error details:', error.error);
          const errorMessage = error.error?.message ? 
            (Array.isArray(error.error.message) ? error.error.message.join(', ') : error.error.message) :
            'Failed to update ingredient';
          this.error.set(errorMessage);
          this.loading.set(false);
        }
      });
    } else {
      // Create new ingredient
      this.ingredientService.createIngredient(ingredientData).subscribe({
        next: (newIngredient) => {
          this.ingredients.update(ingredients => [...ingredients, newIngredient]);
          this.closePopup();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error creating ingredient:', error);
          console.error('Error details:', error.error);
          const errorMessage = error.error?.message ? 
            (Array.isArray(error.error.message) ? error.error.message.join(', ') : error.error.message) :
            'Failed to create ingredient';
          this.error.set(errorMessage);
          this.loading.set(false);
        }
      });
    }
  }

  closePopup() {
    this.showAddForm.set(false);
    this.editingIngredient.set(null);
  }

  trackByIngredientId(index: number, ingredient: Ingredient): string {
    return ingredient.id;
  }
}
