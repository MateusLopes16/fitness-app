import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ingredient, CreateIngredientDto } from '../../interfaces/ingredient.interface';

@Component({
  selector: 'app-add-ingredient-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-ingredient-popup.html',
  styleUrls: ['./add-ingredient-popup.scss']
})
export class AddIngredientPopupComponent implements OnInit {
  @Input() show = false;
  @Input() editingIngredient: Ingredient | null = null;
  @Input() loading = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateIngredientDto>();

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

  ngOnInit() {
    if (this.editingIngredient) {
      this.ingredient.set({
        name: this.editingIngredient.name,
        brand: this.editingIngredient.brand || '',
        barcode: this.editingIngredient.barcode || '',
        caloriesPer100g: this.editingIngredient.caloriesPer100g.toString(),
        proteinPer100g: this.editingIngredient.proteinPer100g.toString(),
        carbsPer100g: this.editingIngredient.carbsPer100g.toString(),
        fatPer100g: this.editingIngredient.fatPer100g.toString(),
        fiberPer100g: this.editingIngredient.fiberPer100g?.toString(),
        sugarPer100g: this.editingIngredient.sugarPer100g?.toString(),
        sodiumPer100g: this.editingIngredient.sodiumPer100g?.toString(),
      });
    }
  }

  updateIngredient(field: keyof CreateIngredientDto, value: any) {
    this.ingredient.update(current => ({
      ...current,
      [field]: value
    }));
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (!this.isFormValid()) {
      return;
    }

    // Clean up the ingredient data before sending
    const ingredientData = { ...this.ingredient() };
    
    // Remove empty strings and convert them to undefined for optional fields
    if (!ingredientData.brand?.trim()) ingredientData.brand = undefined;
    if (!ingredientData.barcode?.trim()) ingredientData.barcode = undefined;
    if (!ingredientData.fiberPer100g?.trim()) ingredientData.fiberPer100g = undefined;
    if (!ingredientData.sugarPer100g?.trim()) ingredientData.sugarPer100g = undefined;
    if (!ingredientData.sodiumPer100g?.trim()) ingredientData.sodiumPer100g = undefined;

    this.save.emit(ingredientData);
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
