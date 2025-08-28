import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth';
import { RegisterRequest, ActivityLevel, Gender } from '../interfaces/auth.interface';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss', './register.animations.scss', './register.responsive.scss']
})
export class RegisterComponent {
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
      height: [''],
      weight: [''],
      dateOfBirth: [''],
      gender: [''],
      activityLevel: ['']
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
        password: formValue.password,
        ...(formValue.height && { height: parseFloat(formValue.height) }),
        ...(formValue.weight && { weight: parseFloat(formValue.weight) }),
        ...(formValue.dateOfBirth && { dateOfBirth: formValue.dateOfBirth }),
        ...(formValue.gender && { gender: formValue.gender as Gender }),
        ...(formValue.activityLevel && { activityLevel: formValue.activityLevel as ActivityLevel })
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
