import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-ingredient-item',
    imports: [CommonModule],
    templateUrl: './ingredient-item.component.html',
    styleUrls: ['./ingredient-item.component.scss']
})
export class IngredientItemComponent {
    @Input() ingredient: any; // Replace 'any' with your ingredient interface
    @Output() edit = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();

    onEdit() {
        this.edit.emit(this.ingredient);
    }

    onDelete() {
        this.delete.emit(this.ingredient);
    }
}