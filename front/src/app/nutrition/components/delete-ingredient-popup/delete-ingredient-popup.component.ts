import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from '../../interfaces/ingredient.interface';

@Component({
  selector: 'app-delete-ingredient-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-ingredient-popup.component.html',
  styleUrl: './delete-ingredient-popup.component.scss'
})
export class DeleteIngredientPopupComponent {
  @Input() show = false;
  @Input() ingredient: Ingredient | null = null;
  @Input() loading = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
