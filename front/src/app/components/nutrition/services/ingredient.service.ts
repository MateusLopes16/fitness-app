import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient, CreateIngredientDto, UpdateIngredientDto } from '../interfaces/ingredient.interface';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

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
    return this.http.get<Ingredient[]>(`${this.apiUrl}/all`, { params });
  }

  getIngredientsPaginated(page: number = 1, limit: number = 20, search?: string): Observable<PaginatedResponse<Ingredient>> {
    let params: any = {
      page: page.toString(),
      limit: limit.toString()
    };
    if (search) {
      params.search = search;
    }
    
    console.log('Calling paginated API:', this.apiUrl, 'with params:', params);
    return this.http.get<PaginatedResponse<Ingredient>>(this.apiUrl, { params });
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
