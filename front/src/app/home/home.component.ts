import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginComponent } from '../auth/login/login';
import { RegisterComponent } from '../auth/register/register';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  showLoginModal = signal(false);
  showRegisterModal = signal(false);
  private modalInteracted = signal(false);

  get isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  ngOnInit() {
    // No need to subscribe to auth success as we're using signals
  }

  openLoginModal() {
    this.showLoginModal.set(true);
    this.showRegisterModal.set(false);
    this.modalInteracted.set(false);
  }

  openRegisterModal() {
    this.showRegisterModal.set(true);
    this.showLoginModal.set(false);
    this.modalInteracted.set(false);
  }

  closeModals() {
    this.showLoginModal.set(false);
    this.showRegisterModal.set(false);
    this.modalInteracted.set(false);
  }

  onOverlayClick(event: Event) {
    // Only close if the clicked element is the overlay itself, not a child
    const target = event.target as HTMLElement;
    const overlay = event.currentTarget as HTMLElement;
    
    // Only close on direct overlay clicks and only if no recent interaction
    if (target === overlay && !this.modalInteracted()) {
      this.closeModals();
    }
    
    // Reset interaction flag after a delay to allow intentional overlay clicks
    setTimeout(() => {
      this.modalInteracted.set(false);
    }, 300);
  }

  onModalContentInteraction() {
    // Track that user has interacted with modal content
    this.modalInteracted.set(true);
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
