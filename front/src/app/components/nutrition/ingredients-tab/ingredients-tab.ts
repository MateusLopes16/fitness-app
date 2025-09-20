import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  constructor(private router: Router) { }
}
