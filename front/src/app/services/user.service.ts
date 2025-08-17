import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityLevel, FitnessObjective, User } from '../auth/interfaces/auth.interface';

export interface UpdateUserDto {
  name?: string;
  email?: string;
  height?: number;
  weight?: number;
  activityLevel?: ActivityLevel;
  objective?: FitnessObjective;
  workoutsPerWeek?: number;
  dateOfBirth?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/v1/users';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateProfile(updateData: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/profile`, updateData);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
