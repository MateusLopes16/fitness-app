import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss',
    './home.animations.scss',
    './home.responsive.scss'
  ]
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  ngOnInit() {
    // No need to subscribe to auth success as we're using signals
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
