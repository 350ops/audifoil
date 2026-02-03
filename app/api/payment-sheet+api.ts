// Payment Sheet API Route
// Creates a PaymentIntent for the Stripe Payment Sheet

import {
  stripe,
  createCustomer,
  createEphemeralKey,
  createPaymentIntent,
  CURRENCY,
} from '@/lib/stripe-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = CURRENCY,
      customerEmail,
      customerName,
      tripId,
      description,
      metadata = {},
    } = body;

    if (!amount || amount <= 0) {
      return Response.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create or retrieve customer
    const customer = await createCustomer(customerEmail, customerName);

    // Create ephemeral key for the customer
    const ephemeralKey = await createEphemeralKey(customer.id);

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount,
      currency,
      customerId: customer.id,
      description: description || `Trip booking: ${tripId}`,
      metadata: {
        tripId: tripId || '',
        customerEmail: customerEmail || '',
        customerName: customerName || '',
        ...metadata,
      },
    });

    return Response.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error: any) {
    console.error('Error creating payment sheet:', error);
    return Response.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}
