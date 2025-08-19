import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { DashboardComponent } from './dashboard/dashboard';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans';
import { NutritionComponent } from './nutrition/nutrition';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'nutrition', component: NutritionComponent, canActivate: [authGuard] },
  { path: 'subscription-plans', component: SubscriptionPlansComponent },
  { path: '**', redirectTo: '' }
];
