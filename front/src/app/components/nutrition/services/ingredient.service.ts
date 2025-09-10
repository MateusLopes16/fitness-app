import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient, CreateIngredientDto, UpdateIngredientDto } from '../interfaces/ingredient.interface';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private apiUrl = 'http://localhost:3000/api/v1/ingredients';

  constructor(private http: HttpClient) {}

  getIngredients(search?: string): Observable<Ingredient[]> {
    let params: any = {};
    if (search) {
      params.search = search;
    }
    return this.http.get<Ingredient[]>(this.apiUrl, { params });
  }

  getIngredient(id: string): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.apiUrl}/${id}`);
  }

  createIngredient(ingredient: CreateIngredientDto): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.apiUrl, ingredient);
  }

  updateIngredient(id: string, ingredient: UpdateIngredientDto): Observable<Ingredient> {
    return this.http.patch<Ingredient>(`${this.apiUrl}/${id}`, ingredient);
  }

  deleteIngredient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
