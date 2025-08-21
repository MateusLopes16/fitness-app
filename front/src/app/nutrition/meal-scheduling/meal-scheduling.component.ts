import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealScheduleService } from '../services/meal-schedule.service';
import { MealService } from '../services/meal.service';
import { MealSchedule, CreateMealScheduleDto } from '../interfaces/meal-schedule.interface';
import { Meal, MealType } from '../interfaces/meal.interface';

@Component({
  selector: 'app-meal-scheduling',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-scheduling.component.html',
  styleUrls: ['./meal-scheduling.component.scss']
})
export class MealSchedulingComponent implements OnInit {
  // Current state
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  selectedMealSchedule = signal<MealSchedule | null>(null);
  
  // Data
  mealSchedules = signal<MealSchedule[]>([]);
  availableMeals = signal<Meal[]>([]);
  
  // UI state
  loading = signal<boolean>(false);
  error = signal<string>('');
  showAddMealDialog = signal<boolean>(false);
  
  // Add meal form
  addMealForm = signal<CreateMealScheduleDto>({
    mealId: '',
    date: new Date().toISOString().split('T')[0],
    mealType: 'BREAKFAST',
    notes: ''
  });

  // Meal types for UI
  mealTypes = [
    { value: 'BREAKFAST', label: 'Breakfast', icon: '🌅' },
    { value: 'LUNCH', label: 'Lunch', icon: '☀️' },
    { value: 'DINNER', label: 'Dinner', icon: '🌙' },
    { value: 'SNACK', label: 'Snack', icon: '🍪' }
  ];

  constructor(
    private mealScheduleService: MealScheduleService,
    private mealService: MealService
  ) {}

  ngOnInit() {
    this.loadTodaysMealSchedules();
    this.loadAvailableMeals();
  }

  loadTodaysMealSchedules() {
    this.loading.set(true);
    this.error.set('');
    
    this.mealScheduleService.getMealSchedules({ date: this.selectedDate() }).subscribe({
      next: (schedules) => {
        this.mealSchedules.set(schedules);
        // Select first meal if none selected
        if (!this.selectedMealSchedule() && schedules.length > 0) {
          this.selectedMealSchedule.set(schedules[0]);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading meal schedules:', error);
        this.error.set('Failed to load meal schedules');
        this.loading.set(false);
      }
    });
  }

  loadAvailableMeals() {
    this.mealService.getMeals().subscribe({
      next: (meals) => {
        this.availableMeals.set(meals);
      },
      error: (error) => {
        console.error('Error loading meals:', error);
      }
    });
  }

  onDateChange(newDate: string) {
    this.selectedDate.set(newDate);
    this.selectedMealSchedule.set(null);
    this.loadTodaysMealSchedules();
  }

  selectMealSchedule(schedule: MealSchedule) {
    this.selectedMealSchedule.set(schedule);
  }

  getMealTypeIcon(mealType: string): string {
    const type = this.mealTypes.find(t => t.value === mealType);
    return type ? type.icon : '🍽️';
  }

  getMealTypeLabel(mealType: string): string {
    const type = this.mealTypes.find(t => t.value === mealType);
    return type ? type.label : mealType;
  }

  toggleMealCompleted(schedule: MealSchedule) {
    this.loading.set(true);
    
    const updateObservable = schedule.completed 
      ? this.mealScheduleService.markMealNotCompleted(schedule.id)
      : this.mealScheduleService.markMealCompleted(schedule.id);

    updateObservable.subscribe({
      next: (updatedSchedule) => {
        // Update the schedule in the list
        this.mealSchedules.update(schedules => 
          schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s)
        );
        
        // Update selected schedule if it's the same
        if (this.selectedMealSchedule()?.id === updatedSchedule.id) {
          this.selectedMealSchedule.set(updatedSchedule);
        }
        
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error updating meal completion:', error);
        this.error.set('Failed to update meal');
        this.loading.set(false);
      }
    });
  }

  openAddMealDialog() {
    this.addMealForm.set({
      mealId: '',
      date: this.selectedDate(),
      mealType: 'BREAKFAST',
      notes: ''
    });
    this.showAddMealDialog.set(true);
  }

  closeAddMealDialog() {
    this.showAddMealDialog.set(false);
  }

  updateAddMealForm(field: keyof CreateMealScheduleDto, value: any) {
    this.addMealForm.update(current => ({
      ...current,
      [field]: value
    }));
  }

  addMealToSchedule() {
    if (!this.addMealForm().mealId) {
      this.error.set('Please select a meal');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.mealScheduleService.createMealSchedule(this.addMealForm()).subscribe({
      next: (newSchedule) => {
        this.mealSchedules.update(schedules => [...schedules, newSchedule]);
        this.closeAddMealDialog();
        this.loading.set(false);
        
        // Select the newly added meal
        this.selectedMealSchedule.set(newSchedule);
      },
      error: (error) => {
        console.error('Error adding meal to schedule:', error);
        const errorMessage = error.error?.message || 'Failed to add meal to schedule';
        this.error.set(errorMessage);
        this.loading.set(false);
      }
    });
  }

  deleteMealFromSchedule(schedule: MealSchedule) {
    if (!confirm('Are you sure you want to remove this meal from your schedule?')) {
      return;
    }

    this.loading.set(true);
    
    this.mealScheduleService.deleteMealSchedule(schedule.id).subscribe({
      next: () => {
        this.mealSchedules.update(schedules => 
          schedules.filter(s => s.id !== schedule.id)
        );
        
        // Clear selection if deleted meal was selected
        if (this.selectedMealSchedule()?.id === schedule.id) {
          this.selectedMealSchedule.set(null);
        }
        
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error deleting meal schedule:', error);
        this.error.set('Failed to delete meal from schedule');
        this.loading.set(false);
      }
    });
  }

  // Calculate total nutrition for the day
  getTotalCalories(): number {
    return this.mealSchedules().reduce((total, schedule) => {
      return total + (schedule.meal.totalCalories || 0);
    }, 0);
  }

  getTotalProtein(): number {
    return this.mealSchedules().reduce((total, schedule) => {
      return total + (schedule.meal.totalProtein || 0);
    }, 0);
  }

  getTotalCarbs(): number {
    return this.mealSchedules().reduce((total, schedule) => {
      return total + (schedule.meal.totalCarbs || 0);
    }, 0);
  }

  getTotalFat(): number {
    return this.mealSchedules().reduce((total, schedule) => {
      return total + (schedule.meal.totalFat || 0);
    }, 0);
  }

  getCompletedMealsCount(): number {
    return this.mealSchedules().filter(schedule => schedule.completed).length;
  }
}
