import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from '../../../interfaces/ingredient.interface';
import { Router } from '@angular/router';

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

  private router = inject(Router);

  onEdit() {
    if (this.ingredient === undefined || this.ingredient.createdByType === 'admin') {
      // TODO => notify cant delete with reason 
      return;
    }
    this.router.navigate(['/nutrition/edit-ingredient', this.ingredient.id]);
  }

  onDelete() {
    if (this.ingredient) {
      this.delete.emit(this.ingredient);
    }
  }
}
