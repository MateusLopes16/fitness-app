export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  height?: number;
  weight?: number;
  dateOfBirth?: string;
  gender?: Gender;
  activityLevel?: ActivityLevel;
  objective?: FitnessObjective;
  workoutsPerWeek?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  height?: number;
  weight?: number;
  dateOfBirth?: string;
  gender?: Gender;
  activityLevel?: ActivityLevel;
  objective?: FitnessObjective;
  workoutsPerWeek?: number;
  createdAt: string;
  updatedAt: string;
}

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
  MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
  EXTREMELY_ACTIVE = 'EXTREMELY_ACTIVE',
}

export enum FitnessObjective {
  BULK = 'BULK',
  LEAN = 'LEAN',
  MAINTAIN = 'MAINTAIN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
