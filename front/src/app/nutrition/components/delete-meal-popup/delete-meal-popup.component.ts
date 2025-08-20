import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../interfaces/meal.interface';

@Component({
  selector: 'app-delete-meal-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-meal-popup.component.html',
  styleUrls: ['./delete-meal-popup.component.scss']
})
export class DeleteMealPopupComponent {
  meal = input<Meal | null>(null);
  loading = input<boolean>(false);

  close = output<void>();
  confirm = output<void>();

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
