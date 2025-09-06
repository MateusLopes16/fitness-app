import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: [
    './home.scss',
    './home.responsive.scss'
  ]
})
export class Home {
  private authService = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToSubscriptionPlans() {
    this.router.navigate(['/subscription-plans']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
