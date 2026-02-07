// Stripe Server-side Utilities
// This file contains server-side Stripe operations

import Stripe from 'stripe';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'foiltribe',
    version: '1.0.0',
  },
});

// Currency configuration
export const CURRENCY = 'usd';

// Create a customer in Stripe
export async function createCustomer(email?: string, name?: string): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'foiltribe App',
    },
  });
}

// Create an ephemeral key for the customer
export async function createEphemeralKey(customerId: string): Promise<Stripe.EphemeralKey> {
  return stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: '2024-06-20' }
  );
}

// Create a payment intent
export interface CreatePaymentIntentParams {
  amount: number; // in cents
  currency?: string;
  customerId: string;
  description?: string;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent(params: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency || CURRENCY,
    customer: params.customerId,
    automatic_payment_methods: {
      enabled: true,
    },
    description: params.description,
    metadata: params.metadata,
  });
}

// Create a Stripe Payment Link for sharing
export interface CreatePaymentLinkParams {
  priceInCents: number;
  productName: string;
  productDescription?: string;
  tripId: string;
  tripDate: string;
  tripTime: string;
  inviterName?: string;
}

export async function createPaymentLink(params: CreatePaymentLinkParams): Promise<Stripe.PaymentLink> {
  // First create a product
  const product = await stripe.products.create({
    name: params.productName,
    description: params.productDescription,
    metadata: {
      tripId: params.tripId,
      tripDate: params.tripDate,
      tripTime: params.tripTime,
      inviterName: params.inviterName || '',
    },
  });

  // Create a price for the product
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: params.priceInCents,
    currency: CURRENCY,
  });

  // Create the payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    metadata: {
      tripId: params.tripId,
      tripDate: params.tripDate,
      tripTime: params.tripTime,
      inviterName: params.inviterName || '',
    },
    after_completion: {
      type: 'redirect',
      redirect: {
        url: `https://foiltribe.com/booking-confirmed?trip=${params.tripId}`,
      },
    },
  });

  return paymentLink;
}

// Get payment link URL
export async function getPaymentLinkUrl(paymentLinkId: string): Promise<string> {
  const paymentLink = await stripe.paymentLinks.retrieve(paymentLinkId);
  return paymentLink.url;
}

// Retrieve a payment intent to check status
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

// List customer's payment methods
export async function listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });
  return paymentMethods.data;
}
