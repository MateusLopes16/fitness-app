import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  @Output() deleteIngredient = new EventEmitter<Ingredient>();

  constructor(private router: Router) {}

  onEdit(ingredient: Ingredient): void {
    if (ingredient.createdByType === 'admin') {
      return;
    }
    this.router.navigate(['/nutrition/edit-ingredient', ingredient.id]);
  }

  onDelete(ingredient: Ingredient): void {
    if (ingredient.createdByType === 'admin') {
      return;
    }
    this.deleteIngredient.emit(ingredient);
  }

  onAddNew(): void {
    this.router.navigate(['/nutrition/add-ingredient']);
  }

  trackByIngredientId(index: number, ingredient: Ingredient): string {
    return ingredient.id;
  }
}
