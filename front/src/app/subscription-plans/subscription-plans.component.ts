import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StripeService } from '../services/stripe.service';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
  color: string;
}

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent implements OnInit {
  plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      period: 'forever',
      color: 'var(--dark-text-secondary)',
      features: [
        'Limited ingredients access',
        'Basic meal plans',
        'Limited workout plans',
        'Community support'
      ]
    },
    {
      id: 'food',
      name: 'Food Plan',
      price: 6.99,
      period: 'month',
      color: 'var(--primary-color)',
      features: [
        'Full ingredients database',
        'Personalized meal plans',
        'Video explanations',
        'Detailed meal descriptions',
        'Nutritional analysis',
        'Custom recipes'
      ]
    },
    {
      id: 'workout',
      name: 'Workout Plan',
      price: 6.99,
      period: 'month',
      color: 'var(--secondary-color)',
      features: [
        'Full workout plans for home & gym',
        'Personal exercise customization',
        'Video demonstrations',
        'Progress tracking',
        'Equipment alternatives',
        'Expert guidance'
      ]
    },
    {
      id: 'full',
      name: 'Full Plan',
      price: 9.99,
      period: 'month',
      color: 'var(--accent-color)',
      recommended: true,
      features: [
        'Everything from Food Plan',
        'Everything from Workout Plan',
        'Priority support',
        'Advanced analytics',
        'Exclusive content',
        'Personal coaching sessions'
      ]
    }
  ];

  processingPayment = false;
  selectedPlan: string | null = null;

  constructor(
    private router: Router,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {}

  selectPlan(plan: SubscriptionPlan): void {
    if (plan.id === 'free') {
      // Handle free plan selection (redirect to dashboard)
      this.router.navigate(['/dashboard']);
    } else {
      // Handle premium plan selection with Stripe payment
      this.processPayment(plan);
    }
  }

  private async processPayment(plan: SubscriptionPlan): Promise<void> {
    try {
      this.processingPayment = true;
      this.selectedPlan = plan.id;
      
      console.log('Processing payment for plan:', plan.name);
      
      await this.stripeService.redirectToCheckout(plan.id, plan.price);
    } catch (error) {
      console.error('Payment processing error:', error);
      this.processingPayment = false;
      this.selectedPlan = null;
      // Handle error - show user-friendly message
      alert('Payment processing failed. Please try again.');
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
