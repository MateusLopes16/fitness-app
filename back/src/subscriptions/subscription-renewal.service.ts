import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionRenewalService {
  private readonly logger = new Logger(SubscriptionRenewalService.name);

  constructor(private prisma: DatabaseService) {}

  // Run every day at 2 AM to check for expiring subscriptions
  @Cron('0 2 * * *')
  async handleSubscriptionRenewal() {
    this.logger.log('Starting subscription renewal check...');

    try {
      // Find all active subscriptions that are expiring today or have expired
      const now = new Date();
      const expiredSubscriptions = await this.prisma.subscription.findMany({
        where: {
          status: SubscriptionStatus.ACTIVE, // Only renew ACTIVE subscriptions (not PAUSED)
          currentPeriodEnd: {
            lte: now, // Less than or equal to current date (expired)
          },
          plan: {
            not: 'FREE', // Don't renew free plans
          },
        },
        include: {
          user: true,
        },
      });

      this.logger.log(`Found ${expiredSubscriptions.length} expired subscriptions to process`);

      for (const subscription of expiredSubscriptions) {
        try {
          await this.renewSubscription(subscription.id, subscription.userId);
          this.logger.log(`Successfully renewed subscription for user ${subscription.userId}`);
        } catch (error) {
          this.logger.error(`Failed to renew subscription for user ${subscription.userId}:`, error);
          // Continue processing other subscriptions even if one fails
        }
      }

      this.logger.log('Subscription renewal check completed');
    } catch (error) {
      this.logger.error('Error during subscription renewal check:', error);
    }
  }

  // Renew a specific subscription
  private async renewSubscription(subscriptionId: string, userId: string) {
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        currentPeriodStart,
        currentPeriodEnd,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Subscription ${subscriptionId} renewed until ${currentPeriodEnd.toISOString()}`);
  }

  // Check for subscriptions expiring in the next 3 days and send notifications
  @Cron('0 10 * * *') // Run every day at 10 AM
  async handleExpirationNotifications() {
    this.logger.log('Checking for subscriptions expiring soon...');

    try {
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      const now = new Date();

      const expiringSubscriptions = await this.prisma.subscription.findMany({
        where: {
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd: {
            gte: now,
            lte: threeDaysFromNow,
          },
          plan: {
            not: 'FREE',
          },
        },
        include: {
          user: true,
        },
      });

      this.logger.log(`Found ${expiringSubscriptions.length} subscriptions expiring in the next 3 days`);

      for (const subscription of expiringSubscriptions) {
        // Here you would typically send an email notification
        // For now, we'll just log it
        if (subscription.currentPeriodEnd) {
          const daysRemaining = Math.ceil(
            (subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          this.logger.log(
            `Subscription for user ${subscription.user.email} expires in ${daysRemaining} days (${subscription.currentPeriodEnd.toISOString()})`
          );
        }
      }
    } catch (error) {
      this.logger.error('Error checking for expiring subscriptions:', error);
    }
  }

  // Manual method to check and renew subscriptions (for testing or manual triggers)
  async checkAndRenewExpiredSubscriptions() {
    this.logger.log('Manual subscription renewal check triggered');
    await this.handleSubscriptionRenewal();
  }

  // Get subscription renewal statistics
  async getRenewalStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const renewalsThisMonth = await this.prisma.subscription.count({
      where: {
        updatedAt: {
          gte: startOfMonth,
        },
        status: SubscriptionStatus.ACTIVE,
        plan: {
          not: 'FREE',
        },
      },
    });

    const expiringSoon = await this.prisma.subscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: {
          gte: now,
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
        plan: {
          not: 'FREE',
        },
      },
    });

    return {
      renewalsThisMonth,
      expiringSoon,
    };
  }
}
