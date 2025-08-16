import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth';
import { ActivityLevel } from '../auth/interfaces/auth.interface';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  currentUser = this.authService.currentUser;
  paymentMessage: string | null = null;

  ngOnInit() {
    // Check for payment success/failure messages
    this.route.queryParams.subscribe(params => {
      if (params['payment'] === 'success') {
        const plan = params['plan'];
        this.paymentMessage = `🎉 Payment successful! Welcome to the ${plan} plan!`;
        // Here you would typically update the user's subscription status
      } else if (params['payment'] === 'cancelled') {
        this.paymentMessage = '❌ Payment was cancelled. You can try again anytime.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatActivityLevel(level?: ActivityLevel): string {
    if (!level) return '';
    
    switch (level) {
      case ActivityLevel.SEDENTARY:
        return 'Sedentary';
      case ActivityLevel.LIGHTLY_ACTIVE:
        return 'Lightly Active';
      case ActivityLevel.MODERATELY_ACTIVE:
        return 'Moderately Active';
      case ActivityLevel.VERY_ACTIVE:
        return 'Very Active';
      case ActivityLevel.EXTREMELY_ACTIVE:
        return 'Extremely Active';
      default:
        return level;
    }
  }
}
