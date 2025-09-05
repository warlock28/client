// Example using Stripe SDK
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent (Stripe example)
export async function createPaymentIntent(amount, currency = 'INR', metadata = {}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in paise
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (error) {
    console.error('Stripe createPaymentIntent error:', error);
    throw error;
  }
}

// Verify webhook signature example (adjust per gateway)
export function verifyStripeSignature(rawBody, signature, secret) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, secret);
    return event;
  } catch (err) {
    throw new Error('Webhook signature verification failed.');
  }
}
