import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginComponent } from '../auth/login/login';
import { RegisterComponent } from '../auth/register/register';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  showLoginModal = signal(false);
  showRegisterModal = signal(false);

  get isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  ngOnInit() {
    // No need to subscribe to auth success as we're using signals
  }

  openLoginModal() {
    this.showLoginModal.set(true);
    this.showRegisterModal.set(false);
  }

  openRegisterModal() {
    this.showRegisterModal.set(true);
    this.showLoginModal.set(false);
  }

  closeModals() {
    this.showLoginModal.set(false);
    this.showRegisterModal.set(false);
  }

  switchToRegister() {
    this.showLoginModal.set(false);
    this.showRegisterModal.set(true);
  }

  switchToLogin() {
    this.showRegisterModal.set(false);
    this.showLoginModal.set(true);
  }

  navigateToSubscriptionPlans() {
    this.router.navigate(['/subscription-plans']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
