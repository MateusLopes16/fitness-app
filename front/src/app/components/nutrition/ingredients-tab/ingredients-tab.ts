import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Ingredient } from '../interfaces/ingredient.interface';
import { IngredientsList } from './ingredients-list/ingredients-list';

@Component({
  selector: 'app-ingredients-tab',
  imports: [CommonModule, IngredientsList],
  templateUrl: './ingredients-tab.html',
  styleUrls: ['./ingredients-tab.scss',
    './ingredients-tab.responsive.scss'
  ]
})
export class IngredientsTab {
  @Input() loading: boolean = false;

  constructor(private router: Router) { }

  onAddNew(): void {
    this.router.navigate(['/nutrition/add-ingredient']);
  }

}
