import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth';
import { ActivityLevel, FitnessObjective } from '../auth/interfaces/auth.interface';
import { SubscriptionService, Subscription } from '../services/subscription.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private subscriptionService = inject(SubscriptionService);
  private userService = inject(UserService);

  currentUser = this.authService.currentUser;
  paymentMessage: string | null = null;
  isEditingProfile = signal(false);
  profileForm: FormGroup;

  // Subscription data from service
  subscription: Subscription | null = null;
  isLoadingSubscription = signal(true);

  constructor() {
    this.profileForm = this.fb.group({
      name: [this.currentUser()?.name || '', [Validators.required]],
      email: [this.currentUser()?.email || '', [Validators.required, Validators.email]],
      height: [this.currentUser()?.height || '', [Validators.min(50), Validators.max(300)]],
      weight: [this.currentUser()?.weight || '', [Validators.min(20), Validators.max(500)]],
      activityLevel: [this.currentUser()?.activityLevel || ''],
      objective: [this.currentUser()?.objective || FitnessObjective.MAINTAIN],
      workoutsPerWeek: [this.currentUser()?.workoutsPerWeek || 3, [Validators.min(0), Validators.max(7)]]
    });
  }

  ngOnInit() {
    // Refresh user profile data from database
    this.refreshUserProfile();
    
    // Load user's subscription info from database
    this.loadSubscriptionInfo();
    
    // Check for payment success/failure messages
    this.route.queryParams.subscribe(params => {
      if (params['payment'] === 'success') {
        const plan = params['plan'];
        this.paymentMessage = `🎉 Payment successful! Welcome to the ${this.subscriptionService.formatPlanDisplay(plan)} plan!`;
        // Update subscription plan in database
        this.subscriptionService.updateSubscriptionPlan(plan.toUpperCase()).subscribe({
          next: (response) => {
            this.subscription = response.data;
            console.log('Subscription updated after payment:', response.data);
          },
          error: (error) => {
            console.error('Failed to update subscription after payment:', error);
          }
        });
      } else if (params['payment'] === 'cancelled') {
        this.paymentMessage = '❌ Payment was cancelled. You can try again anytime.';
      }
    });
  }

  refreshUserProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        console.log('Fresh user data loaded:', user);
        this.authService.updateCurrentUser(user);
        // Update form with fresh data
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          height: user.height,
          weight: user.weight,
          activityLevel: user.activityLevel,
          objective: user.objective,
          workoutsPerWeek: user.workoutsPerWeek
        });
      },
      error: (error) => {
        console.error('Failed to load fresh user data:', error);
      }
    });
  }

  loadSubscriptionInfo() {
    this.isLoadingSubscription.set(true);
    this.subscriptionService.getUserSubscription().subscribe({
      next: (response) => {
        this.subscription = response.data;
        this.isLoadingSubscription.set(false);
        console.log('Subscription loaded:', response.data);
      },
      error: (error) => {
        console.error('Failed to load subscription:', error);
        this.isLoadingSubscription.set(false);
        // Create a default free subscription if none exists
        this.subscriptionService.createSubscription('FREE').subscribe({
          next: (response) => {
            this.subscription = response.data;
            console.log('Default subscription created:', response.data);
          },
          error: (createError) => {
            console.error('Failed to create default subscription:', createError);
          }
        });
      }
    });
  }

  formatObjective(objective?: FitnessObjective): string {
    console.log('Formatting objective:', objective);
    if (!objective) return 'Not set';
    
    switch (objective) {
      case FitnessObjective.BULK:
        return 'Bulk (Muscle Gain)';
      case FitnessObjective.LEAN:
        return 'Lean (Fat Loss)';
      case FitnessObjective.MAINTAIN:
        return 'Maintain Weight';
      default:
        return objective;
    }
  }

  toggleEditProfile(): void {
    this.isEditingProfile.set(!this.isEditingProfile());
    if (!this.isEditingProfile()) {
      // Reset form when canceling
      this.profileForm.patchValue({
        name: this.currentUser()?.name || '',
        email: this.currentUser()?.email || '',
        height: this.currentUser()?.height || '',
        weight: this.currentUser()?.weight || '',
        activityLevel: this.currentUser()?.activityLevel || '',
        objective: this.currentUser()?.objective || FitnessObjective.MAINTAIN,
        workoutsPerWeek: this.currentUser()?.workoutsPerWeek || 3
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      console.log('Saving profile:', formValue);
      
      // Convert string values to appropriate types
      const updateData = {
        name: formValue.name,
        email: formValue.email,
        height: formValue.height ? Number(formValue.height) : undefined,
        weight: formValue.weight ? Number(formValue.weight) : undefined,
        activityLevel: formValue.activityLevel,
        objective: formValue.objective,
        workoutsPerWeek: formValue.workoutsPerWeek ? Number(formValue.workoutsPerWeek) : undefined
      };

      this.userService.updateProfile(updateData).subscribe({
        next: (updatedUser) => {
          console.log('Profile updated successfully:', updatedUser);
          
          // Update the auth service current user
          this.authService.updateCurrentUser(updatedUser);
          
          // Toggle edit mode off
          this.isEditingProfile.set(false);
          
          // Show success message
          alert('Profile updated successfully!');
          
          // Force refresh the view by updating the form values
          this.profileForm.patchValue({
            name: updatedUser.name,
            email: updatedUser.email,
            height: updatedUser.height,
            weight: updatedUser.weight,
            activityLevel: updatedUser.activityLevel,
            objective: updatedUser.objective,
            workoutsPerWeek: updatedUser.workoutsPerWeek
          });
        },
        error: (error) => {
          console.error('Failed to update profile:', error);
          alert('Failed to update profile. Please try again.');
        }
      });
    }
  }

  getActivityLevels() {
    return Object.values(ActivityLevel);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Calculate Basal Metabolic Rate (BMR) using Harris-Benedict equation
  calculateBMR(): number {
    const user = this.currentUser();
    if (!user?.height || !user?.weight) return 0;

    // Assuming male for simplicity - in a real app, you'd have gender field
    // BMR for men: 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)
    // For now, using age 30 as default since we don't have birthdate calculation
    const age = 30; // Default age
    const weight = Number(user.weight);
    const height = Number(user.height);
    
    return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
  }

  // Calculate Total Daily Energy Expenditure (TDEE)
  calculateTDEE(): number {
    const bmr = this.calculateBMR();
    if (!bmr) return 0;

    const user = this.currentUser();
    const activityMultipliers = {
      [ActivityLevel.SEDENTARY]: 1.2,
      [ActivityLevel.LIGHTLY_ACTIVE]: 1.375,
      [ActivityLevel.MODERATELY_ACTIVE]: 1.55,
      [ActivityLevel.VERY_ACTIVE]: 1.725,
      [ActivityLevel.EXTREMELY_ACTIVE]: 1.9
    };

    const multiplier = activityMultipliers[user?.activityLevel || ActivityLevel.SEDENTARY];
    return Math.round(bmr * multiplier);
  }

  // Calculate target calories based on objective
  calculateTargetCalories(): number {
    const tdee = this.calculateTDEE();
    if (!tdee) return 0;

    const user = this.currentUser();
    const objective = user?.objective || FitnessObjective.MAINTAIN;

    switch (objective) {
      case FitnessObjective.BULK:
        return Math.round(tdee * 1.1); // 10% higher
      case FitnessObjective.LEAN:
        return Math.round(tdee * 0.9); // 10% lower
      case FitnessObjective.MAINTAIN:
      default:
        return tdee;
    }
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

  // Subscription helper methods
  getSubscriptionPlanDisplay(): string {
    return this.subscription ? this.subscriptionService.formatPlanDisplay(this.subscription.plan) : 'Free Plan';
  }

  getSubscriptionPlanColor(): string {
    return this.subscription ? this.subscriptionService.getPlanColor(this.subscription.plan) : 'var(--text-muted)';
  }

  getSubscriptionPlanIcon(): string {
    return this.subscription ? this.subscriptionService.getPlanIcon(this.subscription.plan) : '🆓';
  }

  getSubscriptionStatus(): string {
    return this.subscription?.status || 'Active';
  }

  getSubscriptionStartDate(): Date {
    return this.subscription ? new Date(this.subscription.createdAt) : new Date();
  }

  getRemainingDays(): number {
    return this.subscription ? this.subscriptionService.getRemainingDays(this.subscription.currentPeriodEnd) : 0;
  }
}
