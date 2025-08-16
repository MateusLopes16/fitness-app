import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';
import { CreateCheckoutSessionDto } from '../dto/create-checkout-session.dto';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    return this.stripeService.createPaymentIntent(createPaymentIntentDto);
  }

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() createCheckoutSessionDto: CreateCheckoutSessionDto) {
    return this.stripeService.createCheckoutSession(createCheckoutSessionDto);
  }

  @Post('webhook')
  async handleWebhook(
    @Body() body: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeService.handleWebhook(body, signature);
  }
}
