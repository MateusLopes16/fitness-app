import { Component, OnInit, OnChanges, SimpleChanges, signal, computed } from '@angular/core';
import { IngredientItem } from './ingredient-item/ingredient-item';
import { Input, Output, EventEmitter } from '@angular/core';
import { Ingredient } from '../../interfaces/ingredient.interface';
import { Router } from '@angular/router';
import { IngredientService } from '../../services/ingredient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredients-list',
  imports: [IngredientItem, CommonModule],
  templateUrl: './ingredients-list.html',
  styleUrls: ['./ingredients-list.scss']
})
export class IngredientsList implements OnInit, OnChanges {
  @Input() filteredIngredients: Ingredient[] | undefined;
  @Output() ingredientSelected = new EventEmitter<Ingredient>();

  ingredients = signal<Ingredient[]>([]);
  loading = signal<boolean>(false);

  // Computed signals for better state management
  hasIngredients = computed(() => this.ingredients().length > 0);
  showEmptyState = computed(() => !this.loading() && !this.hasIngredients());

  constructor(private router: Router, private ingredientService: IngredientService,
  ) { }

  ngOnInit() {
    // Only load ingredients if no filteredIngredients are provided initially
    if (!this.filteredIngredients) {
      this.loadIngredients();
    } else {
      // Set initial filtered ingredients
      this.ingredients.set(this.filteredIngredients);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // React to changes in filteredIngredients
    if (changes['filteredIngredients'] && this.filteredIngredients) {
      this.ingredients.set(this.filteredIngredients);
    }
  }

  onAddNew(): void {
    this.router.navigate(['/nutrition/add-ingredient']);
  }

  trackByIngredientId(index: number, ingredient: Ingredient): string {
    return ingredient.id;
  }

  loadIngredients() {
    console.log('Loading ingredients...');
    this.loading.set(true);
    this.ingredients.set([]); // Clear existing data while loading

    this.ingredientService.getIngredients().subscribe({
      next: (ingredients) => {
        console.log('Ingredients loaded:', ingredients);
        this.ingredients.set(ingredients || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
        this.ingredients.set([]); // Ensure empty array on error
        // this.error.set('Failed to load ingredients');
        this.loading.set(false);
      }
    });
  }

  onDelete(ingredient: Ingredient) {
    if (!ingredient) return;

    this.loading.set(true);
    // this.error.set('');

    this.ingredientService.deleteIngredient(ingredient.id).subscribe({
      next: () => {
        this.ingredients.update(ingredients =>
          ingredients.filter(i => i.id !== ingredient.id)
        );
        this.loading.set(false);
        // this.onCloseDeleteForm();
      },
      error: (error) => {
        console.error('Error deleting ingredient:', error);
        // this.error.set('Failed to delete ingredient');
        this.loading.set(false);
      }
    });
  }

  onIngredientSelected(ingredient: Ingredient) {
    this.ingredientSelected.emit(ingredient);
  }

}
