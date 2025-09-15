import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  // Replace with your actual Stripe publishable key
  private publishableKey = 'pk_test_51OV4KJKrQZJK2uVvs3XoO7vZmPxKrQZJK2uVvs3XoO7vZmPx';

  constructor() {
    this.stripePromise = loadStripe(this.publishableKey);
  }

  async createCheckoutSession(priceId: string, quantity: number = 1) {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    // In production, this would call your backend API to create a session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        quantity,
        successUrl: window.location.origin + '/success',
        cancelUrl: window.location.origin + '/checkout',
      }),
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });

    if (result.error) {
      throw result.error;
    }
  }

  async getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  async createPaymentElement(clientSecret: string): Promise<StripeElements> {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    return stripe.elements({
      clientSecret,
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#007AFF',
          colorBackground: '#1a1a2e',
          colorText: '#ffffff',
          colorDanger: '#ef4444',
          borderRadius: '12px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
      },
    });
  }
}