// Shared Stripe utilities for Supabase Edge Functions
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

// Initialize Stripe with the secret key from environment
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

export const CURRENCY = 'usd';

// Create or retrieve a Stripe customer
export async function createCustomer(
  email?: string,
  name?: string
): Promise<Stripe.Customer> {
  // If email provided, try to find existing customer
  if (email) {
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });
    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }
  }

  // Create new customer
  return await stripe.customers.create({
    email: email || undefined,
    name: name || undefined,
  });
}

// Create an ephemeral key for the customer
export async function createEphemeralKey(
  customerId: string
): Promise<Stripe.EphemeralKey> {
  return await stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: '2024-06-20' }
  );
}

// Create a payment intent
export async function createPaymentIntent(params: {
  amount: number;
  currency: string;
  customerId: string;
  description?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency,
    customer: params.customerId,
    description: params.description,
    metadata: params.metadata || {},
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

// Create a Stripe Payment Link
export async function createPaymentLink(params: {
  priceInCents: number;
  productName: string;
  productDescription?: string;
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}): Promise<Stripe.PaymentLink> {
  // Create a product
  const product = await stripe.products.create({
    name: params.productName,
    description: params.productDescription,
  });

  // Create a price for the product
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: params.priceInCents,
    currency: CURRENCY,
  });

  // Create the payment link
  return await stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    metadata: params.metadata || {},
    after_completion: {
      type: 'redirect',
      redirect: {
        url: params.successUrl || 'https://foiltribe.com/booking-success',
      },
    },
  });
}

// CORS headers for edge functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
