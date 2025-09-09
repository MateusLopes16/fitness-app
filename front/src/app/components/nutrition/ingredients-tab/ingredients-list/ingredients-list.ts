import { Component, OnInit, signal } from '@angular/core';
import { IngredientItem } from './ingredient-item/ingredient-item';
import { Input, Output, EventEmitter } from '@angular/core';
import { Ingredient } from '../../interfaces/ingredient.interface';
import { Router } from '@angular/router';
import { IngredientService } from '../../../../nutrition/services/ingredient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredients-list',
  imports: [IngredientItem, CommonModule],
  templateUrl: './ingredients-list.html',
  styleUrls: ['./ingredients-list.scss']
})
export class IngredientsList implements OnInit {
  ingredients = signal<Ingredient[]>([]);
  loading = signal<boolean>(false);

  constructor(private router: Router, private ingredientService: IngredientService,
  ) { }

  ngOnInit() {
    this.loadIngredients();
  }

  onAddNew(): void {
    this.router.navigate(['/nutrition/add-ingredient']);
  }

  trackByIngredientId(index: number, ingredient: Ingredient): string {
    return ingredient.id;
  }

  loadIngredients() {
    console.error("ijianianiai");
    this.loading.set(true);
    // this.error.set('');

    this.ingredientService.getIngredients().subscribe({
      next: (ingredients) => {
        this.ingredients.set(ingredients);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
        // this.error.set('Failed to load ingredients');
        this.loading.set(false);
      }
    });
  }

}
