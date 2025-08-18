import { Module } from '@nestjs/common';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from './stripe/stripe.service';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionRenewalService } from './subscription-renewal.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StripeController, SubscriptionsController],
  providers: [StripeService, SubscriptionsService, SubscriptionRenewalService],
  exports: [StripeService, SubscriptionsService, SubscriptionRenewalService],
})
export class SubscriptionsModule {}
