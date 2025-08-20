import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meal, MealType, DuplicateMealDto } from '../../interfaces/meal.interface';

@Component({
  selector: 'app-duplicate-meal-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './duplicate-meal-popup.component.html',
  styleUrls: ['./duplicate-meal-popup.component.scss']
})
export class DuplicateMealPopupComponent {
  meal = input<Meal | null>(null);
  loading = input<boolean>(false);

  close = output<void>();
  duplicate = output<DuplicateMealDto>();

  duplicateData: DuplicateMealDto = {
    mealType: undefined,
    date: ''
  };

  ngOnInit() {
    // Set default date to today
    const today = new Date();
    this.duplicateData.date = today.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.duplicateData.mealType && this.duplicateData.date) {
      this.duplicate.emit(this.duplicateData);
    }
  }
}
