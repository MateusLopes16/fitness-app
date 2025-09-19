import { Routes } from '@angular/router';
import { Home } from './components/home/home'
import { Dashboard } from './components/dashboard/dashboard';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { Nutrition } from './components/nutrition/nutrition';
import { AddIngredient } from './components/nutrition/ingredients-tab/add-ingredient/add-ingredient';
import { AddMeal } from './components/nutrition/meals-tab/add-meal/add-meal';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { authGuard } from './components/auth/auth-guard';
import { MealDetails } from './components/nutrition/meals-tab/meal-details/meal-details';
import { Daily } from './components/nutrition/scheduling-tab/daily/daily';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'nutrition', component: Nutrition, canActivate: [authGuard] },
  { path: 'nutrition/add-ingredient', component: AddIngredient, canActivate: [authGuard] },
  { path: 'nutrition/edit-ingredient/:id', component: AddIngredient, canActivate: [authGuard] },
  { path: 'nutrition/add-meal', component: AddMeal, canActivate: [authGuard] },
  { path: 'nutrition/edit-meal/:id', component: AddMeal, canActivate: [authGuard] },
  { path: 'nutrition/meal/:id', component: MealDetails, canActivate: [authGuard] },
  { path: 'nutrition/daily', component: Daily, canActivate: [authGuard] },
  { path: 'nutrition/daily/:date', component: Daily, canActivate: [authGuard] },
  { path: 'subscription-plans', component: SubscriptionPlansComponent },
  { path: '**', redirectTo: '' }
];
