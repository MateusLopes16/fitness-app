import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Ingredient } from '../../interfaces/ingredient.interface';
import { IngredientsListComponent } from './ingredients-list/ingredients-list.component';


@Component({
  selector: 'app-ingredients-tab',
  standalone: true,
  imports: [CommonModule, IngredientsListComponent],
  templateUrl: './ingredients-tab.component.html',
  styleUrls: [
    './ingredients-tab.component.scss',
    './ingredients-tab.responsive.scss'
  ],
})
export class IngredientsTabComponent {
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
