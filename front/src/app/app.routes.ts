import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { AddIngredientComponent } from './nutrition/components/ingredients-tab/add-ingredient/add-ingredient.component';
import { AddMealComponent } from './nutrition/components/meals-list/add-meal/add-meal.component';
import { MealDetailComponent } from './nutrition/components/meals-list/meal-detail/meal-detail.component';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'nutrition', component: NutritionComponent, canActivate: [authGuard] },
  { path: 'nutrition/add-ingredient', component: AddIngredientComponent, canActivate: [authGuard] },
  { path: 'nutrition/edit-ingredient/:id', component: AddIngredientComponent, canActivate: [authGuard] },
  { path: 'nutrition/add-meal', component: AddMealComponent, canActivate: [authGuard] },
  { path: 'nutrition/edit-meal/:id', component: AddMealComponent, canActivate: [authGuard] },
  { path: 'nutrition/meal/:id', component: MealDetailComponent, canActivate: [authGuard] },
  { path: 'subscription-plans', component: SubscriptionPlansComponent },
  { path: '**', redirectTo: '' }
];
