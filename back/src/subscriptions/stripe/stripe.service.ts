import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';
import { CreateCheckoutSessionDto } from '../dto/create-checkout-session.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not configured in environment variables');
      throw new Error('Stripe secret key is not configured');
    }

    console.log('Initializing Stripe with key:', stripeSecretKey.substring(0, 12) + '...');
    
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-07-30.basil',
    });
  }

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    const { amount, currency, planId } = createPaymentIntentDto;

    console.log('Creating payment intent for:', { planId, amount, currency });

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'usd',
        metadata: {
          planId,
        },
      });

      console.log('Payment intent created successfully:', paymentIntent.id);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Failed to create payment intent:', error.message);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  async createCheckoutSession(createCheckoutSessionDto: CreateCheckoutSessionDto) {
    const { planId, successUrl, cancelUrl } = createCheckoutSessionDto;

    // Define your subscription plans
    const plans = {
      food: {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Food Plan',
            description: 'Full ingredients database, personalized meals, video explanations',
          },
          unit_amount: 699, // $6.99
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
      workout: {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Workout Plan',
            description: 'Full workout plans for home & gym, personal exercises',
          },
          unit_amount: 699, // $6.99
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
      full: {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Full Plan',
            description: 'Everything from Food Plan + Workout Plan + premium features',
          },
          unit_amount: 999, // $9.99
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    };

    if (!plans[planId]) {
      throw new Error('Invalid plan ID');
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [plans[planId]],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          planId,
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }

  async handleWebhook(body: any, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret is not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Handle successful payment
        console.log('Payment succeeded for session:', session.id);
        // Update user subscription in database
        break;
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        // Handle successful recurring payment
        console.log('Recurring payment succeeded:', invoice.id);
        break;
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        // Handle failed payment
        console.log('Payment failed:', failedInvoice.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
