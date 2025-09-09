import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from '../../../interfaces/ingredient.interface';

@Component({
  selector: 'app-ingredient-item',
  imports: [CommonModule],
  templateUrl: './ingredient-item.html',
  styleUrls: ['./ingredient-item.scss', './ingredient-item.responsive.scss']
})
export class IngredientItem {
  @Input() ingredient: Ingredient | undefined;
  @Output() edit = new EventEmitter<Ingredient>();
  @Output() delete = new EventEmitter<Ingredient>();

  onEdit() {
    if (this.ingredient) {
      this.edit.emit(this.ingredient);
    }
  }

  onDelete() {
    if (this.ingredient) {
      this.delete.emit(this.ingredient);
    }
  }
}
