import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Meal, MealType } from '../../../interfaces/meal.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meal-item',
  imports: [CommonModule],
  templateUrl: './meal-item.html',
  styleUrls: [
    './meal-item.scss',
    './meal-item.responsive.scss'
  ]
})
export class MealItem {
  @Input() meal!: Meal;
  @Output() edit = new EventEmitter<Meal>();
  @Output() duplicate = new EventEmitter<Meal>();
  @Output() delete = new EventEmitter<Meal>();
  @Output() select = new EventEmitter<Meal>();

  private router = inject(Router);

  onView() {
    this.router.navigate(['/nutrition/meal', this.meal.id]);
  }

  onSelect() {
    this.select.emit(this.meal);
  }

  onEdit() {
    if (this.meal === undefined || this.meal.createdByType === 'admin') {
      // TODO => notify cant delete with reason 
      return;
    }
    this.router.navigate(['/nutrition/edit-meal', this.meal.id]);
  }

  onDuplicate() {
    this.duplicate.emit(this.meal);
  }

  onDelete() {
    this.delete.emit(this.meal);
  }

  getMealTypeIcon(mealType: MealType): string {
    switch (mealType) {
      case MealType.BREAKFAST: return '🌅';
      case MealType.LUNCH: return '☀️';
      case MealType.DINNER: return '🌙';
      case MealType.SNACK: return '🍪';
      default: return '🍽️';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
