import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-meal-item',
  imports: [CommonModule],
  templateUrl: './daily-meal-item.component.html',
  styleUrls: ['./daily-meal-item.component.scss']
})
export class DailyMealItem {
  mealsPerDay = [
    { name: 'Breakfast', time: '8:00 AM' },
    { name: 'Lunch', time: '12:00 PM' },
    { name: 'Dinner', time: '7:00 PM' },
    { name: 'Breakfast', time: '8:00 AM' },
    { name: 'Lunch', time: '12:00 PM' },
    { name: 'Dinner', time: '7:00 PM' }
  ];
}
