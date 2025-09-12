import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MealsList } from './meals-list/meals-list';



@Component({
  selector: 'app-meals-tab',
  imports: [MealsList],
  templateUrl: './meals-tab.html',
  styleUrl: './meals-tab.scss'
})
export class MealsTab {

  private router = inject(Router);

  onAddNew(): void {
    this.router.navigate(['/nutrition/add-meal']);
  }
}
