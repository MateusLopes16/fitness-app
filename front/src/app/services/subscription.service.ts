import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: any;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:3000/api/v1/subscriptions';
  private subscriptionSubject = new BehaviorSubject<Subscription | null>(null);
  public subscription$ = this.subscriptionSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserSubscription(): Observable<ApiResponse<Subscription>> {
    return this.http.get<ApiResponse<Subscription>>(this.apiUrl).pipe(
      tap(response => {
        if (response.data) {
          this.subscriptionSubject.next(response.data);
        }
      })
    );
  }

  createSubscription(plan: string, stripeCustomerId?: string, stripeSubscriptionId?: string): Observable<ApiResponse<Subscription>> {
    const body = {
      plan,
      stripeCustomerId,
      stripeSubscriptionId
    };
    
    return this.http.post<ApiResponse<Subscription>>(this.apiUrl, body).pipe(
      tap(response => {
        if (response.data) {
          this.subscriptionSubject.next(response.data);
        }
      })
    );
  }

  updateSubscriptionPlan(plan: string): Observable<ApiResponse<Subscription>> {
    return this.http.put<ApiResponse<Subscription>>(`${this.apiUrl}/plan`, { plan }).pipe(
      tap(response => {
        if (response.data) {
          this.subscriptionSubject.next(response.data);
        }
      })
    );
  }

  cancelSubscription(): Observable<ApiResponse<Subscription>> {
    return this.http.delete<ApiResponse<Subscription>>(this.apiUrl).pipe(
      tap(response => {
        if (response.data) {
          this.subscriptionSubject.next(response.data);
        }
      })
    );
  }

  pauseAutoRenewal(): Observable<ApiResponse<Subscription>> {
    return this.http.put<ApiResponse<Subscription>>(`${this.apiUrl}/pause`, {}).pipe(
      tap(response => {
        if (response.data) {
          this.subscriptionSubject.next(response.data);
        }
      })
    );
  }

  resumeAutoRenewal(): Observable<ApiResponse<Subscription>> {
    return this.http.put<ApiResponse<Subscription>>(`${this.apiUrl}/resume`, {}).pipe(
      tap(response => {
        if (response.data) {
          this.subscriptionSubject.next(response.data);
        }
      })
    );
  }

  formatPlanName(plan: string): Observable<ApiResponse<{original: string, formatted: string}>> {
    return this.http.get<ApiResponse<{original: string, formatted: string}>>(`${this.apiUrl}/format-plan/${plan}`);
  }

  // Helper methods for frontend display
  formatPlanDisplay(plan: string): string {
    switch (plan?.toUpperCase()) {
      case 'FREE':
        return 'Free Plan';
      case 'FOOD':
        return 'Food Plan';
      case 'WORKOUT':
        return 'Workout Plan';
      case 'FULL':
        return 'Full Plan';
      default:
        return 'Free Plan';
    }
  }

  getPlanColor(plan: string): string {
    switch (plan?.toUpperCase()) {
      case 'FREE':
        return 'var(--text-muted)';
      case 'FOOD':
        return 'var(--success-color)';
      case 'WORKOUT':
        return 'var(--warning-color)';
      case 'FULL':
        return 'var(--primary-color)';
      default:
        return 'var(--text-muted)';
    }
  }

  getPlanIcon(plan: string): string {
    switch (plan?.toUpperCase()) {
      case 'FREE':
        return '🆓';
      case 'FOOD':
        return '🍎';
      case 'WORKOUT':
        return '💪';
      case 'FULL':
        return '⭐';
      default:
        return '🆓';
    }
  }

  isActivePlan(status: string): boolean {
    return status?.toUpperCase() === 'ACTIVE';
  }

  isPausedPlan(status: string): boolean {
    return status?.toUpperCase() === 'PAUSED';
  }

  isCancelledPlan(status: string): boolean {
    return status?.toUpperCase() === 'CANCELLED';
  }

  getStatusDisplay(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'Active (Auto-renewing)';
      case 'PAUSED':
        return 'Active (Auto-renewal paused)';
      case 'CANCELLED':
        return 'Cancelled';
      case 'INACTIVE':
        return 'Inactive';
      case 'PAST_DUE':
        return 'Past Due';
      default:
        return 'Unknown';
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'var(--success-color)';
      case 'PAUSED':
        return 'var(--warning-color)';
      case 'CANCELLED':
        return 'var(--error-color)';
      case 'INACTIVE':
        return 'var(--text-muted)';
      case 'PAST_DUE':
        return 'var(--error-color)';
      default:
        return 'var(--text-muted)';
    }
  }

  getRemainingDays(endDate: Date | string): number {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  // Initialize subscription data on service startup
  loadUserSubscription(): void {
    this.getUserSubscription().subscribe({
      next: (response) => {
        console.log('Subscription loaded:', response.data);
      },
      error: (error) => {
        console.error('Failed to load subscription:', error);
      }
    });
  }
}
