import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MealSchedule, CreateMealScheduleDto, UpdateMealScheduleDto, MealScheduleQueryDto } from '../interfaces/meal-schedule.interface';

@Injectable({
  providedIn: 'root'
})
export class MealScheduleService {
  private apiUrl = 'http://localhost:3000/api/v1/meal-schedules';

  constructor(private http: HttpClient) {}

  getMealSchedules(query?: MealScheduleQueryDto): Observable<MealSchedule[]> {
    let params: any = {};
    if (query?.date) params.date = query.date;
    if (query?.startDate) params.startDate = query.startDate;
    if (query?.endDate) params.endDate = query.endDate;
    if (query?.mealType) params.mealType = query.mealType;
    if (query?.completed !== undefined) params.completed = query.completed.toString();
    
    return this.http.get<MealSchedule[]>(this.apiUrl, { params });
  }

  getMealSchedule(id: string): Observable<MealSchedule> {
    return this.http.get<MealSchedule>(`${this.apiUrl}/${id}`);
  }

  createMealSchedule(mealSchedule: CreateMealScheduleDto): Observable<MealSchedule> {
    return this.http.post<MealSchedule>(this.apiUrl, mealSchedule);
  }

  updateMealSchedule(id: string, mealSchedule: UpdateMealScheduleDto): Observable<MealSchedule> {
    return this.http.patch<MealSchedule>(`${this.apiUrl}/${id}`, mealSchedule);
  }

  deleteMealSchedule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Helper method to get today's meal schedules
  getTodaysMealSchedules(): Observable<MealSchedule[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getMealSchedules({ date: today });
  }

  // Helper method to get this week's meal schedules
  getWeekMealSchedules(): Observable<MealSchedule[]> {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    return this.getMealSchedules({
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0]
    });
  }

  // Helper method to mark meal as completed
  markMealCompleted(id: string): Observable<MealSchedule> {
    return this.updateMealSchedule(id, { completed: true });
  }

  // Helper method to mark meal as not completed
  markMealNotCompleted(id: string): Observable<MealSchedule> {
    return this.updateMealSchedule(id, { completed: false });
  }

  // Get weekly schedule
  getWeekSchedule(date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/week/${date}`);
  }

  // Plan entire week
  planWeek(weekPlan: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/week/plan`, weekPlan);
  }

  // Get daily nutrition summary
  getDailyNutrition(date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nutrition/daily/${date}`);
  }

  // Helper method to get week range
  getWeekRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return { start, end };
  }
}
