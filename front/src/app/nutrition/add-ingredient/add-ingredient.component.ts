import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IngredientService } from '../services/ingredient.service';
import { Ingredient, CreateIngredientDto } from '../interfaces/ingredient.interface';

@Component({
  selector: 'app-add-ingredient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss']
})
export class AddIngredientComponent implements OnInit {
  loading = signal<boolean>(false);
  error = signal<string>('');
  isEditing = signal<boolean>(false);
  ingredientId = signal<string | null>(null);

  ingredient = signal<CreateIngredientDto>({
    name: '',
    brand: '',
    barcode: '',
    caloriesPer100g: '0',
    proteinPer100g: '0',
    carbsPer100g: '0',
    fatPer100g: '0',
    fiberPer100g: undefined,
    sugarPer100g: undefined,
    sodiumPer100g: undefined,
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ingredientService: IngredientService
  ) {}

  ngOnInit() {
    // Check if we're editing an existing ingredient
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ingredientId.set(id);
      this.isEditing.set(true);
      this.loadIngredient(id);
    }
  }

  loadIngredient(id: string) {
    this.loading.set(true);
    this.ingredientService.getIngredient(id).subscribe({
      next: (ingredient) => {
        this.ingredient.set({
          name: ingredient.name,
          brand: ingredient.brand || '',
          barcode: ingredient.barcode || '',
          caloriesPer100g: ingredient.caloriesPer100g.toString(),
          proteinPer100g: ingredient.proteinPer100g.toString(),
          carbsPer100g: ingredient.carbsPer100g.toString(),
          fatPer100g: ingredient.fatPer100g.toString(),
          fiberPer100g: ingredient.fiberPer100g?.toString(),
          sugarPer100g: ingredient.sugarPer100g?.toString(),
          sodiumPer100g: ingredient.sodiumPer100g?.toString(),
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading ingredient:', error);
        this.error.set('Failed to load ingredient');
        this.loading.set(false);
      }
    });
  }

  updateIngredient(field: keyof CreateIngredientDto, value: any) {
    this.ingredient.update(current => ({
      ...current,
      [field]: value
    }));
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

    // Clean up the ingredient data before sending
    const ingredientData = { ...this.ingredient() };
    
    // Remove empty strings and convert them to undefined for optional fields
    if (!ingredientData.brand?.trim()) ingredientData.brand = undefined;
    if (!ingredientData.barcode?.trim()) ingredientData.barcode = undefined;
    if (!ingredientData.fiberPer100g?.trim()) ingredientData.fiberPer100g = undefined;
    if (!ingredientData.sugarPer100g?.trim()) ingredientData.sugarPer100g = undefined;
    if (!ingredientData.sodiumPer100g?.trim()) ingredientData.sodiumPer100g = undefined;

    const request = this.isEditing() 
      ? this.ingredientService.updateIngredient(this.ingredientId()!, ingredientData)
      : this.ingredientService.createIngredient(ingredientData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/nutrition']);
      },
      error: (error) => {
        console.error('Error saving ingredient:', error);
        const errorMessage = error.error?.message ? 
          (Array.isArray(error.error.message) ? error.error.message.join(', ') : error.error.message) :
          `Failed to ${this.isEditing() ? 'update' : 'create'} ingredient`;
        this.error.set(errorMessage);
        this.loading.set(false);
      }
    });
  }

  isFormValid(): boolean {
    const ing = this.ingredient();
    return !!(
      ing.name?.trim() &&
      ing.caloriesPer100g && parseFloat(ing.caloriesPer100g) >= 0 &&
      ing.proteinPer100g && parseFloat(ing.proteinPer100g) >= 0 &&
      ing.carbsPer100g && parseFloat(ing.carbsPer100g) >= 0 &&
      ing.fatPer100g && parseFloat(ing.fatPer100g) >= 0
    );
  }
}
