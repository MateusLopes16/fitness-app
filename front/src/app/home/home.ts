import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../auth/login/login';
import { RegisterComponent } from '../auth/register/register';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  showLoginModal = signal(false);
  showRegisterModal = signal(false);

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
}
