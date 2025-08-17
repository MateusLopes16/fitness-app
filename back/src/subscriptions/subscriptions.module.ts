import { Module } from '@nestjs/common';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from './stripe/stripe.service';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StripeController, SubscriptionsController],
  providers: [StripeService, SubscriptionsService],
  exports: [StripeService, SubscriptionsService],
})
export class SubscriptionsModule {}
