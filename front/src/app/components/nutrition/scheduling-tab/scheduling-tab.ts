import { Component } from '@angular/core';
import { CommonModule, getLocaleWeekEndRange } from '@angular/common';
import { Daily } from './daily/daily';
import { Weekly } from './weekly/weekly';

@Component({
  selector: 'app-scheduling-tab',
  imports: [CommonModule, Daily, Weekly],
  templateUrl: './scheduling-tab.html',
  styleUrl: './scheduling-tab.scss'
})
export class SchedulingTab {
  currentView: 'daily' | 'weekly' = 'daily';

  switchTab(view: 'daily' | 'weekly'): void {
    this.currentView = view;
  }
}
