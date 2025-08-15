import { Component, inject, signal, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth';
import { LoginRequest } from '../interfaces/auth.interface';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  // Output event to close modal
  loginSuccess = output<void>();
  
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const loginData: LoginRequest = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          console.log('Login successful:', response);
          this.loginSuccess.emit();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Login error:', error);
          
          if (error.status === 401) {
            this.errorMessage.set('Invalid email or password');
          } else if (error.status === 0) {
            this.errorMessage.set('Cannot connect to server. Please try again later.');
          } else {
            this.errorMessage.set('An error occurred. Please try again.');
          }
        }
      });
    }
  }
}
