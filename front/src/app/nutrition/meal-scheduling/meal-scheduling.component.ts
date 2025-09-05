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
  // View modes
  viewMode = signal<'daily' | 'weekly'>('weekly');
  
  // Current state
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  selectedMealSchedule = signal<MealSchedule | null>(null);
  currentWeek = signal<Date>(new Date());
  
  // Data
  mealSchedules = signal<MealSchedule[]>([]);
  weekSchedule = signal<any[]>([]);
  availableMeals = signal<Meal[]>([]);
  
  // UI state
  loading = signal<boolean>(false);
  error = signal<string>('');
  showAddMealDialog = signal<boolean>(false);
  showWeekPlanDialog = signal<boolean>(false);
  
  // Add meal form
  addMealForm = signal<CreateMealScheduleDto>({
    mealId: '',
    date: new Date().toISOString().split('T')[0],
    mealType: 'BREAKFAST',
    notes: ''
  });

  // Week planning
  weekPlanForm = signal<any>({
    startDate: '',
    mealPlans: []
  });

  // Meal types for UI
  mealTypes: { value: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK', label: string, icon: string }[] = [
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
    this.loadAvailableMeals();
    if (this.viewMode() === 'daily') {
      this.loadTodaysMealSchedules();
    } else {
      this.loadWeekSchedule();
    }
  }

  switchViewMode(mode: 'daily' | 'weekly') {
    this.viewMode.set(mode);
    this.selectedMealSchedule.set(null);
    if (mode === 'daily') {
      this.loadTodaysMealSchedules();
    } else {
      this.loadWeekSchedule();
    }
  }

  loadWeekSchedule() {
    this.loading.set(true);
    this.error.set('');
    
    const currentDate = new Date(this.currentWeek());
    const dateStr = currentDate.toISOString().split('T')[0];
    
    this.mealScheduleService.getWeekSchedule(dateStr).subscribe({
      next: (weekData) => {
        this.weekSchedule.set(weekData);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading week schedule:', error);
        this.error.set('Failed to load week schedule');
        this.loading.set(false);
      }
    });
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
    if (this.viewMode() === 'daily') {
      this.loadTodaysMealSchedules();
    } else {
      // Update current week based on selected date
      this.currentWeek.set(new Date(newDate));
      this.loadWeekSchedule();
    }
  }

  navigateWeek(direction: 'prev' | 'next') {
    const current = new Date(this.currentWeek());
    const newWeek = new Date(current);
    newWeek.setDate(current.getDate() + (direction === 'next' ? 7 : -7));
    this.currentWeek.set(newWeek);
    this.loadWeekSchedule();
  }

  getCurrentWeekRange(): { start: string; end: string } {
    const { start, end } = this.mealScheduleService.getWeekRange(this.currentWeek());
    return {
      start: start.toLocaleDateString(),
      end: end.toLocaleDateString()
    };
  }

  getDaySchedules(date: string): MealSchedule[] {
    const dayData = this.weekSchedule().find(day => day.date === date);
    return dayData ? dayData.schedules : [];
  }

  getDayNutrition(date: string): any {
    const dayData = this.weekSchedule().find(day => day.date === date);
    return dayData ? dayData.nutrition : {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      mealsCount: 0,
      completedMeals: 0
    };
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
        
        // Reload week schedule if in weekly view
        if (this.viewMode() === 'weekly') {
          this.loadWeekSchedule();
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
        
        // Reload week schedule if in weekly view
        if (this.viewMode() === 'weekly') {
          this.loadWeekSchedule();
        }
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
        
        // Reload week schedule if in weekly view
        if (this.viewMode() === 'weekly') {
          this.loadWeekSchedule();
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

  // Week planning methods
  openWeekPlanDialog() {
    const { start } = this.mealScheduleService.getWeekRange(this.currentWeek());
    this.weekPlanForm.set({
      startDate: start.toISOString().split('T')[0],
      mealPlans: []
    });
    this.showWeekPlanDialog.set(true);
  }

  closeWeekPlanDialog() {
    this.showWeekPlanDialog.set(false);
  }

  addMealToPlan(date: string, mealType: string) {
    this.weekPlanForm.update(form => ({
      ...form,
      mealPlans: [...form.mealPlans, {
        date,
        mealType,
        mealId: '',
        notes: ''
      }]
    }));
  }

  removeMealFromPlan(index: number) {
    this.weekPlanForm.update(form => ({
      ...form,
      mealPlans: form.mealPlans.filter((_: any, i: number) => i !== index)
    }));
  }

  updatePlanMeal(index: number, field: string, value: any) {
    this.weekPlanForm.update(form => ({
      ...form,
      mealPlans: form.mealPlans.map((plan: any, i: number) => 
        i === index ? { ...plan, [field]: value } : plan
      )
    }));
  }

  saveWeekPlan() {
    const validPlans = this.weekPlanForm().mealPlans.filter((plan: any) => plan.mealId);
    
    if (validPlans.length === 0) {
      this.error.set('Please add at least one meal to the plan');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const weekPlan = {
      startDate: this.weekPlanForm().startDate,
      mealPlans: validPlans
    };

    this.mealScheduleService.planWeek(weekPlan).subscribe({
      next: () => {
        this.closeWeekPlanDialog();
        this.loadWeekSchedule();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error planning week:', error);
        this.error.set('Failed to save week plan');
        this.loading.set(false);
      }
    });
  }

  // Helper methods for week view
  getWeekDays(): string[] {
    const { start } = this.mealScheduleService.getWeekRange(this.currentWeek());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day.toISOString().split('T')[0]);
    }
    return days;
  }

  getDayName(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  }

  getDayDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  isToday(date: string): boolean {
    return date === new Date().toISOString().split('T')[0];
  }

  getScheduledMealForType(day: string, mealType: string): MealSchedule | undefined {
    return this.getDaySchedules(day).find(s => s.mealType === mealType);
  }

  hasScheduledMealForType(day: string, mealType: string): boolean {
    return !!this.getScheduledMealForType(day, mealType);
  }

  addMealForDayAndType(day: string, mealType: string) {
    this.addMealForm.set({
      mealId: '',
      date: day,
      mealType: mealType as 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK',
      notes: ''
    });
    this.openAddMealDialog();
  }
}
