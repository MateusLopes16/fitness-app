import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Subscription, SubscriptionStatus } from '@prisma/client';

// Define the enum locally since it might not be generated yet
enum SubscriptionPlan {
  FREE = 'FREE',
  FOOD = 'FOOD',
  WORKOUT = 'WORKOUT',
  FULL = 'FULL',
}

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: DatabaseService) {}

  async createSubscription(
    userId: string,
    plan: string,
    stripeCustomerId?: string,
    stripeSubscriptionId?: string,
  ): Promise<Subscription> {
    // First, check if user already has a subscription
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription) {
      // Update existing subscription
      return this.prisma.subscription.update({
        where: { userId },
        data: {
          plan: plan as any, // Use any for now until types are regenerated
          status: SubscriptionStatus.ACTIVE,
          stripeCustomerId,
          stripeSubscriptionId,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          updatedAt: new Date(),
        },
        include: {
          user: true,
        },
      });
    }

    // Create new subscription
    return this.prisma.subscription.create({
      data: {
        userId,
        plan: plan as any, // Use any for now until types are regenerated
        status: SubscriptionStatus.ACTIVE,
        stripeCustomerId,
        stripeSubscriptionId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      include: {
        user: true,
      },
    });
  }

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    console.log('SubscriptionsService - Getting subscription for userId:', userId);
    
    try {
      const subscription = await this.prisma.subscription.findUnique({
        where: { userId },
        include: {
          user: true,
        },
      });

      console.log('SubscriptionsService - Found subscription:', !!subscription);

      // If no subscription exists, create a default FREE subscription
      if (!subscription) {
        console.log('SubscriptionsService - Creating default FREE subscription');
        return this.createSubscription(userId, SubscriptionPlan.FREE);
      }

      return subscription;
    } catch (error) {
      console.error('SubscriptionsService - Error getting subscription:', error);
      throw error;
    }
  }

  async updateSubscriptionPlan(
    userId: string,
    plan: string,
  ): Promise<Subscription> {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.subscription.update({
      where: { userId },
      data: {
        plan: plan as any, // Use any for now until types are regenerated
        status: SubscriptionStatus.ACTIVE,
        updatedAt: new Date(),
      },
      include: {
        user: true,
      },
    });
  }

  async cancelSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.subscription.update({
      where: { userId },
      data: {
        status: SubscriptionStatus.CANCELLED,
        updatedAt: new Date(),
      },
      include: {
        user: true,
      },
    });
  }

  formatPlanName(plan: string): string {
    switch (plan) {
      case SubscriptionPlan.FREE:
        return 'Free Plan';
      case SubscriptionPlan.FOOD:
        return 'Food Plan';
      case SubscriptionPlan.WORKOUT:
        return 'Workout Plan';
      case SubscriptionPlan.FULL:
        return 'Full Plan';
      default:
        return 'Free Plan';
    }
  }

  getPlanFromString(planString: string): string {
    switch (planString.toLowerCase()) {
      case 'food':
        return SubscriptionPlan.FOOD;
      case 'workout':
        return SubscriptionPlan.WORKOUT;
      case 'full':
        return SubscriptionPlan.FULL;
      default:
        return SubscriptionPlan.FREE;
    }
  }
}
