import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meal, MealType, DuplicateMealDto } from '../../interfaces/meal.interface';

@Component({
  selector: 'app-duplicate-meal-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="duplicate-overlay" (click)="close.emit()">
      <div class="duplicate-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>📋 Duplicate Meal</h3>
          <button class="close-btn" (click)="close.emit()">✕</button>
        </div>

        <div class="modal-content">
          <div class="meal-info">
            <h4>{{ meal()?.name }}</h4>
            <p>{{ meal()?.description || 'No description' }}</p>
            <div class="nutrition-summary">
              <span>{{ meal()?.totalCalories?.toFixed(0) || '0' }} cal</span>
              <span>{{ meal()?.totalProtein?.toFixed(1) || '0' }}g protein</span>
              <span>{{ meal()?.ingredients?.length || 0 }} ingredients</span>
            </div>
          </div>

          <form (ngSubmit)="onSubmit()" #duplicateForm="ngForm">
            <div class="form-group">
              <label for="mealType">Meal Type</label>
              <select
                id="mealType"
                name="mealType"
                [(ngModel)]="duplicateData.mealType"
                class="form-select"
                required
              >
                <option value="">Select meal type</option>
                <option value="BREAKFAST">🌅 Breakfast</option>
                <option value="LUNCH">☀️ Lunch</option>
                <option value="DINNER">🌙 Dinner</option>
                <option value="SNACK">🍪 Snack</option>
              </select>
            </div>

            <div class="form-group">
              <label for="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                [(ngModel)]="duplicateData.date"
                class="form-input"
                required
              >
            </div>
          </form>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" (click)="close.emit()">
            Cancel
          </button>
          <button
            type="button"
            class="btn-primary"
            (click)="onSubmit()"
            [disabled]="!duplicateForm.form.valid || loading()"
          >
            <span *ngIf="loading()" class="spinner"></span>
            Duplicate Meal
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./duplicate-meal-popup.scss']
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
