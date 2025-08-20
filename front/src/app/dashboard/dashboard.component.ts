import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth';
import { ActivityLevel, FitnessObjective, Gender } from '../auth/interfaces/auth.interface';
import { SubscriptionService, Subscription } from '../services/subscription.service';
import { UserService } from '../services/user.service';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { NotificationComponent, NotificationData } from '../shared/notification/notification.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, ConfirmationDialogComponent, NotificationComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
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

  // Dialog and notification state
  showConfirmDialog = signal(false);
  confirmDialogData: ConfirmationDialogData | null = null;
  isProcessingAction = signal(false);
  
  showNotification = signal(false);
  notificationData: NotificationData | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      name: [this.currentUser()?.name || '', [Validators.required]],
      email: [this.currentUser()?.email || '', [Validators.required, Validators.email]],
      height: [this.currentUser()?.height || '', [Validators.min(50), Validators.max(300)]],
      weight: [this.currentUser()?.weight || '', [Validators.min(20), Validators.max(500)]],
      gender: [this.currentUser()?.gender || ''],
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
          gender: user.gender,
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
        gender: this.currentUser()?.gender || '',
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
        gender: formValue.gender,
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
          
          // Show success notification
          this.notificationData = {
            title: 'Profile Updated',
            message: 'Your profile has been updated successfully!',
            type: 'success',
            autoClose: true,
            duration: 4000
          };
          this.showNotification.set(true);
          
          // Force refresh the view by updating the form values
          this.profileForm.patchValue({
            name: updatedUser.name,
            email: updatedUser.email,
            height: updatedUser.height,
            weight: updatedUser.weight,
            gender: updatedUser.gender,
            activityLevel: updatedUser.activityLevel,
            objective: updatedUser.objective,
            workoutsPerWeek: updatedUser.workoutsPerWeek
          });
        },
        error: (error) => {
          console.error('Failed to update profile:', error);
          this.notificationData = {
            title: 'Update Failed',
            message: 'Failed to update profile. Please try again.',
            type: 'error',
            autoClose: true,
            duration: 4000
          };
          this.showNotification.set(true);
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

    // Using Harris-Benedict equation
    const age = 30; // Default age since we don't have birthdate calculation
    const weight = Number(user.weight);
    const height = Number(user.height);
    const gender = user.gender || Gender.MALE; // Default to male if not specified
    
    if (gender === Gender.MALE) {
      // BMR for men: 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)
      return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
    } else {
      // BMR for women: 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age in years)
      return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
    }
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

  // Calculate protein objective (1.8g per kg of body weight)
  calculateProteinObjective(): number {
    const user = this.currentUser();
    if (!user?.weight) return 0;
    
    const weight = Number(user.weight);
    return Math.round(weight * 1.8);
  }

  formatGender(gender?: Gender): string {
    if (!gender) return 'Not set';
    
    switch (gender) {
      case Gender.MALE:
        return 'Male';
      case Gender.FEMALE:
        return 'Female';
      default:
        return gender;
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

  // Subscription management methods
  isSubscriptionActive(): boolean {
    return this.subscription ? this.subscriptionService.isActivePlan(this.subscription.status) : false;
  }

  isSubscriptionPaused(): boolean {
    return this.subscription ? this.subscriptionService.isPausedPlan(this.subscription.status) : false;
  }

  isSubscriptionCancelled(): boolean {
    return this.subscription ? this.subscriptionService.isCancelledPlan(this.subscription.status) : false;
  }

  getSubscriptionStatusDisplay(): string {
    return this.subscription ? this.subscriptionService.getStatusDisplay(this.subscription.status) : 'Free Plan';
  }

  getSubscriptionStatusColor(): string {
    return this.subscription ? this.subscriptionService.getStatusColor(this.subscription.status) : 'var(--text-muted)';
  }

  canPauseSubscription(): boolean {
    return this.subscription?.plan !== 'FREE' && this.isSubscriptionActive();
  }

  canResumeSubscription(): boolean {
    return this.subscription?.plan !== 'FREE' && this.isSubscriptionPaused();
  }

  canCancelSubscription(): boolean {
    return this.subscription?.plan !== 'FREE' && (this.isSubscriptionActive() || this.isSubscriptionPaused());
  }

  pauseAutoRenewal(): void {
    if (!this.canPauseSubscription()) return;

    this.confirmDialogData = {
      title: 'Pause Auto-Renewal',
      message: 'Are you sure you want to pause auto-renewal? Your subscription will remain active until the end of the current period, but will not renew automatically.',
      confirmText: 'Pause Auto-Renewal',
      cancelText: 'Keep Auto-Renewal',
      type: 'warning',
      icon: '⏸️'
    };
    this.showConfirmDialog.set(true);
  }

  resumeAutoRenewal(): void {
    if (!this.canResumeSubscription()) return;

    this.confirmDialogData = {
      title: 'Resume Auto-Renewal',
      message: 'Are you sure you want to resume auto-renewal? Your subscription will automatically renew each month.',
      confirmText: 'Resume Auto-Renewal',
      cancelText: 'Keep Paused',
      type: 'success',
      icon: '▶️'
    };
    this.showConfirmDialog.set(true);
  }

  cancelSubscription(): void {
    if (!this.canCancelSubscription()) return;

    this.confirmDialogData = {
      title: 'Cancel Subscription',
      message: 'Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.',
      confirmText: 'Cancel Subscription',
      cancelText: 'Keep Subscription',
      type: 'danger',
      icon: '❌'
    };
    this.showConfirmDialog.set(true);
  }

  onConfirmAction(): void {
    if (!this.confirmDialogData) return;

    this.isProcessingAction.set(true);

    const actionType = this.confirmDialogData.icon;
    
    switch (actionType) {
      case '⏸️': // Pause
        this.subscriptionService.pauseAutoRenewal().subscribe({
          next: (response) => {
            this.subscription = response.data;
            this.handleActionSuccess(
              'Auto-Renewal Paused',
              `Auto-renewal has been paused. Your subscription will remain active until ${new Date(this.subscription.currentPeriodEnd).toLocaleDateString()}.`
            );
          },
          error: (error) => {
            this.handleActionError('Failed to pause auto-renewal. Please try again.');
          }
        });
        break;

      case '▶️': // Resume
        this.subscriptionService.resumeAutoRenewal().subscribe({
          next: (response) => {
            this.subscription = response.data;
            this.handleActionSuccess(
              'Auto-Renewal Resumed',
              'Auto-renewal has been resumed. Your subscription will automatically renew each month.'
            );
          },
          error: (error) => {
            this.handleActionError('Failed to resume auto-renewal. Please try again.');
          }
        });
        break;

      case '❌': // Cancel
        this.subscriptionService.cancelSubscription().subscribe({
          next: (response) => {
            this.subscription = response.data;
            this.handleActionSuccess(
              'Subscription Cancelled',
              `Your subscription has been cancelled. You will have access until ${new Date(this.subscription.currentPeriodEnd).toLocaleDateString()}.`
            );
          },
          error: (error) => {
            this.handleActionError('Failed to cancel subscription. Please try again.');
          }
        });
        break;
    }
  }

  onCancelAction(): void {
    this.showConfirmDialog.set(false);
    this.confirmDialogData = null;
    this.isProcessingAction.set(false);
  }

  private handleActionSuccess(title: string, message: string): void {
    this.isProcessingAction.set(false);
    this.showConfirmDialog.set(false);
    this.confirmDialogData = null;
    
    this.notificationData = {
      title,
      message,
      type: 'success',
      autoClose: true,
      duration: 5000
    };
    this.showNotification.set(true);
  }

  private handleActionError(message: string): void {
    this.isProcessingAction.set(false);
    this.showConfirmDialog.set(false);
    this.confirmDialogData = null;
    
    this.notificationData = {
      title: 'Error',
      message,
      type: 'error',
      autoClose: true,
      duration: 5000
    };
    this.showNotification.set(true);
  }

  onNotificationClosed(): void {
    this.showNotification.set(false);
    this.notificationData = null;
  }
}
