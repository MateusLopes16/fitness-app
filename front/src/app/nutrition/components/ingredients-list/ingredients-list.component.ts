import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from '../../interfaces/ingredient.interface';

@Component({
  selector: 'app-ingredients-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.scss']
})
export class IngredientsListComponent {
  @Input() ingredients: Ingredient[] = [];
  @Input() loading: boolean = false;

  @Output() editIngredient = new EventEmitter<Ingredient>();
  @Output() deleteIngredient = new EventEmitter<Ingredient>();
  @Output() addNewIngredient = new EventEmitter<void>();

  onEdit(ingredient: Ingredient): void {
    if (ingredient.createdByType === 'admin') {
      return;
    }
    this.editIngredient.emit(ingredient);
  }

  onDelete(ingredient: Ingredient): void {
    if (ingredient.createdByType === 'admin') {
      return;
    }
    this.deleteIngredient.emit(ingredient);
  }

  onAddNew(): void {
    this.addNewIngredient.emit();
  }

  trackByIngredientId(index: number, ingredient: Ingredient): string {
    return ingredient.id;
  }
}
