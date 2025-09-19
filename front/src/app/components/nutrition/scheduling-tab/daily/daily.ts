import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DaySchedule, DayMeal, MacroSummary, SidePanelState } from '../../interfaces/day-schedule.interface';
import { Meal, MealType } from '../../interfaces/meal.interface';
import { MealsList } from '../../meals-tab/meals-list/meals-list';
import { MealDetails } from '../../meals-tab/meal-details/meal-details';

@Component({
  selector: 'app-daily',
  imports: [CommonModule, MealsList, MealDetails],
  templateUrl: './daily.html',
  styleUrl: './daily.scss'
})
export class Daily implements OnInit {
  // Services
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // State management
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]); // Today in YYYY-MM-DD
  daySchedule = signal<DaySchedule | null>(null);
  sidePanelState = signal<SidePanelState>(SidePanelState.CLOSED);
  selectedMeal = signal<Meal | null>(null);
  
  // Computed values
  dayMeals = computed(() => this.daySchedule()?.meals || []);
  macroSummary = computed((): MacroSummary => {
    const schedule = this.daySchedule();
    if (!schedule) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    return {
      calories: schedule.totalCalories,
      protein: schedule.totalProtein,
      carbs: schedule.totalCarbs,
      fat: schedule.totalFat,
      fiber: schedule.totalFiber,
      sugar: schedule.totalSugar,
      sodium: schedule.totalSodium
    };
  });

  // Expose enums for template
  SidePanelState = SidePanelState;
  MealType = MealType;

  ngOnInit() {
    // Get date from route parameters or query params
    const routeDate = this.route.snapshot.params['date'];
    const queryDate = this.route.snapshot.queryParams['date'];
    
    if (routeDate) {
      // Date from URL path parameter (e.g., /nutrition/daily/2025-09-17)
      this.selectedDate.set(routeDate);
    } else if (queryDate) {
      // Date from query parameter (e.g., /nutrition/daily?date=2025-09-17)
      this.selectedDate.set(queryDate);
    }
    
    this.loadDaySchedule();
  }

  loadDaySchedule() {
    // For now, initialize with empty schedule
    // TODO: Load from service
    const schedule: DaySchedule = {
      date: this.selectedDate(),
      meals: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0
    };
    this.daySchedule.set(schedule);
  }

  onDateChange(date: string) {
    if (date) {
      this.selectedDate.set(date);
      this.loadDaySchedule();
      
      // Update URL to reflect the new date
      this.router.navigate(['/nutrition/daily', date], { 
        replaceUrl: true 
      });
    }
  }

  getMealsByType(mealType: MealType): DayMeal[] {
    return this.dayMeals().filter(dayMeal => dayMeal.mealType === mealType);
  }

  onAddMeals() {
    this.sidePanelState.set(SidePanelState.MEALS_LIST);
  }

  onMealSelected(meal: Meal) {
    if (this.sidePanelState() === SidePanelState.MEALS_LIST) {
      // Add meal to day schedule
      this.addMealToDay(meal);
      this.closeSidePanel();
    }
  }

  onViewMeal(meal: Meal) {
    this.selectedMeal.set(meal);
    this.sidePanelState.set(SidePanelState.MEAL_DETAILS);
  }

  onRemoveMealFromDay(dayMeal: DayMeal) {
    const currentSchedule = this.daySchedule();
    if (!currentSchedule) return;

    const updatedMeals = currentSchedule.meals.filter(m => m.id !== dayMeal.id);
    const updatedSchedule = this.calculateScheduleTotals({
      ...currentSchedule,
      meals: updatedMeals
    });
    
    this.daySchedule.set(updatedSchedule);
  }

  closeSidePanel() {
    this.sidePanelState.set(SidePanelState.CLOSED);
    this.selectedMeal.set(null);
  }

  private addMealToDay(meal: Meal) {
    const currentSchedule = this.daySchedule();
    if (!currentSchedule) return;

    const dayMeal: DayMeal = {
      id: this.generateId(),
      meal: meal,
      mealType: meal.mealType || MealType.SNACK,
      portionMultiplier: 1.0
    };

    const updatedMeals = [...currentSchedule.meals, dayMeal];
    const updatedSchedule = this.calculateScheduleTotals({
      ...currentSchedule,
      meals: updatedMeals
    });

    this.daySchedule.set(updatedSchedule);
  }

  private calculateScheduleTotals(schedule: DaySchedule): DaySchedule {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSugar = 0;
    let totalSodium = 0;

    schedule.meals.forEach(dayMeal => {
      const multiplier = dayMeal.portionMultiplier;
      totalCalories += dayMeal.meal.totalCalories * multiplier;
      totalProtein += dayMeal.meal.totalProtein * multiplier;
      totalCarbs += dayMeal.meal.totalCarbs * multiplier;
      totalFat += dayMeal.meal.totalFat * multiplier;
      totalFiber += (dayMeal.meal.totalFiber || 0) * multiplier;
      totalSugar += (dayMeal.meal.totalSugar || 0) * multiplier;
      totalSodium += (dayMeal.meal.totalSodium || 0) * multiplier;
    });

    return {
      ...schedule,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      totalSugar,
      totalSodium
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
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

  // Navigation methods
  onNavigateToDate(date: string) {
    this.router.navigate(['/nutrition/daily', date]);
  }

  onNavigateToToday() {
    const today = new Date().toISOString().split('T')[0];
    this.router.navigate(['/nutrition/daily', today]);
  }

  onNavigateToPreviousDay() {
    const currentDate = new Date(this.selectedDate());
    currentDate.setDate(currentDate.getDate() - 1);
    const previousDay = currentDate.toISOString().split('T')[0];
    this.router.navigate(['/nutrition/daily', previousDay]);
  }

  onNavigateToNextDay() {
    const currentDate = new Date(this.selectedDate());
    currentDate.setDate(currentDate.getDate() + 1);
    const nextDay = currentDate.toISOString().split('T')[0];
    this.router.navigate(['/nutrition/daily', nextDay]);
  }

  onBackToNutrition() {
    this.router.navigate(['/nutrition']);
  }
}
