import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreatePaymentIntentRequest {
  planId: string;
  amount: number;
  currency: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  
  // Use environment configuration for Stripe key
  private readonly STRIPE_PUBLISHABLE_KEY = environment.stripe.publishableKey;
  
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe(this.STRIPE_PUBLISHABLE_KEY);
  }

  async getStripe(): Promise<Stripe | null> {
    return await this.stripePromise;
  }

  createPaymentIntent(request: CreatePaymentIntentRequest): Observable<CreatePaymentIntentResponse> {
    return this.http.post<CreatePaymentIntentResponse>(`${this.API_URL}/payments/create-payment-intent`, request);
  }

  async redirectToCheckout(planId: string, amount: number): Promise<void> {
    console.log('Starting checkout process for plan:', planId);
    
    try {
      // Create checkout session on your backend
      const response = await this.http.post<{sessionId: string, url: string}>(`${this.API_URL}/payments/create-checkout-session`, {
        planId,
        successUrl: `${window.location.origin}/dashboard?payment=success&plan=${planId}`,
        cancelUrl: `${window.location.origin}/subscription-plans?payment=cancelled`
      }).toPromise();

      console.log('Checkout session created:', response);
      
      if (response && response.url) {
        // Redirect to Stripe Checkout page
        window.location.href = response.url;
      } else {
        throw new Error('Invalid response from checkout session creation');
      }
      
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  // Alternative: Use Stripe Elements for embedded payment form
  async createPaymentMethod(elements: StripeElements, cardElement: StripeCardElement): Promise<any> {
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('Stripe is not loaded');
    }

    return await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
  }

  async confirmPayment(clientSecret: string, paymentMethod: any): Promise<any> {
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('Stripe is not loaded');
    }

    return await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id
    });
  }
}
