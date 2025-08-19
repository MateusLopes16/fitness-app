import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meal, CreateMealDto, UpdateMealDto, DuplicateMealDto, MealType } from '../interfaces/meal.interface';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private apiUrl = 'http://localhost:3000/api/v1/meals';

  constructor(private http: HttpClient) {}

  getMeals(mealType?: MealType): Observable<Meal[]> {
    let params: any = {};
    if (mealType) params.mealType = mealType;
    
    return this.http.get<Meal[]>(this.apiUrl, { params });
  }

  getMeal(id: string): Observable<Meal> {
    return this.http.get<Meal>(`${this.apiUrl}/${id}`);
  }

  getMealsByDate(date: string): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.apiUrl}/date/${date}`);
  }

  createMeal(meal: CreateMealDto): Observable<Meal> {
    return this.http.post<Meal>(this.apiUrl, meal);
  }

  updateMeal(id: string, meal: UpdateMealDto): Observable<Meal> {
    return this.http.patch<Meal>(`${this.apiUrl}/${id}`, meal);
  }

  duplicateMeal(id: string, options: DuplicateMealDto): Observable<Meal> {
    return this.http.post<Meal>(`${this.apiUrl}/${id}/duplicate`, options);
  }

  deleteMeal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
