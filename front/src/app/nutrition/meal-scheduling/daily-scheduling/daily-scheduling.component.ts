import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyMealItem } from '../daily-meal-item/daily-meal-item.component';

@Component({
  selector: 'app-daily-scheduling',
  imports: [CommonModule, DailyMealItem],
  templateUrl: './daily-scheduling.component.html',
  styleUrl: './daily-scheduling.component.scss'
})
export class DailySchedulingComponent {

}
