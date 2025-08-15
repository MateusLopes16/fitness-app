import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  templateUrl: './subscription-plans.html',
  styleUrl: './subscription-plans.scss'
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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  selectPlan(plan: SubscriptionPlan): void {
    if (plan.id === 'free') {
      // Handle free plan selection (maybe redirect to dashboard)
      this.router.navigate(['/dashboard']);
    } else {
      // Handle premium plan selection (implement payment logic)
      console.log('Selected plan:', plan);
      // TODO: Integrate with payment service (Stripe, etc.)
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
