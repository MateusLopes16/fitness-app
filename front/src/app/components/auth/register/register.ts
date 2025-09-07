import { Component } from '@angular/core';
import { inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { RegisterRequest } from '../interfaces/auth.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss', './register.responsive.scss']
})
export class Register {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const formValue = this.registerForm.value;
      const registerData: RegisterRequest = {
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          console.log('Registration successful:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Registration error:', error);

          if (error.status === 409) {
            this.errorMessage.set('An account with this email already exists');
          } else if (error.status === 0) {
            this.errorMessage.set('Cannot connect to server. Please try again later.');
          } else if (error.error?.message) {
            this.errorMessage.set(error.error.message);
          } else {
            this.errorMessage.set('An error occurred during registration. Please try again.');
          }
        }
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
