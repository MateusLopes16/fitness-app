import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IngredientWithQuantity } from '../ingredients-list';
import { ImageModalComponent } from '../../../../shared/image-modal/image-modal.component';

@Component({
  selector: 'app-ingredient-item',
  imports: [CommonModule, ImageModalComponent],
  templateUrl: './ingredient-item.html',
  styleUrls: ['./ingredient-item.scss', './ingredient-item.responsive.scss']
})
export class IngredientItem {
  @Input() ingredient: IngredientWithQuantity | undefined;
  @Input() quantityGrams: number = 100;
  @Input() showActions: boolean = true;
  @Output() deleteIngredient = new EventEmitter<IngredientWithQuantity>();
  @Output() selectedIngredient = new EventEmitter<IngredientWithQuantity>();
  @Input() viewType: string = 'list';


  // Modal state
  isImageModalVisible = false;

  private router = inject(Router);

  getImageUrl(): string {
    const defaultImageUrl = 'https://digitad.ca/wp-content/uploads/2023/01/photo-unsplash-800x573.jpg';
    return this.ingredient?.imageUrl || defaultImageUrl;
  }

  onEdit(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent event bubbling
    }
    if (this.ingredient === undefined || this.ingredient.createdByType === 'admin') {
      // TODO => notify cant delete with reason 
      return;
    }
    this.router.navigate(['/nutrition/edit-ingredient', this.ingredient.id]);
  }

  onDelete(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent event bubbling
    }
    if (this.ingredient) {
      this.deleteIngredient.emit(this.ingredient);
    }
  }

  onSelect() {
    if (this.ingredient) {
      this.selectedIngredient.emit(this.ingredient);
    }
  }


  onImage(event: Event) {
    event.stopPropagation(); // Prevent event bubbling to parent container
    this.isImageModalVisible = true;
  }

  onCloseImageModal() {
    this.isImageModalVisible = false;
  }
}
