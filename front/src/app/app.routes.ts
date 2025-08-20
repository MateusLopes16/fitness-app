import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'nutrition', component: NutritionComponent, canActivate: [authGuard] },
  { path: 'subscription-plans', component: SubscriptionPlansComponent },
  { path: '**', redirectTo: '' }
];
