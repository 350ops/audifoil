// Payment Sheet Edge Function
// Creates a PaymentIntent for the Stripe Payment Sheet

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  corsHeaders,
  createCustomer,
  createEphemeralKey,
  createPaymentIntent,
  CURRENCY,
} from '../_shared/stripe.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
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
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
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

    return new Response(
      JSON.stringify({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error creating payment sheet:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create payment' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
