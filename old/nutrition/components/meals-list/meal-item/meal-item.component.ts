import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Meal, MealType } from '../../../interfaces/meal.interface';

@Component({
    selector: 'app-meal-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './meal-item.component.html',
    styleUrls: [
        './meal-item.component.scss',
        './meal-item.responsive.scss'
    ]
})
export class MealItemComponent {
    @Input() meal!: Meal;
    @Output() view = new EventEmitter<Meal>();
    @Output() edit = new EventEmitter<Meal>();
    @Output() duplicate = new EventEmitter<Meal>();
    @Output() delete = new EventEmitter<Meal>();

    onView() {
        this.view.emit(this.meal);
    }

    onEdit() {
        this.edit.emit(this.meal);
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
