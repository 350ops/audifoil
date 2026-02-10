// Payment Link Edge Function
// Creates a shareable Stripe Payment Link for friends to pay

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, createPaymentLink } from '../_shared/stripe.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      tripId,
      tripDate,
      tripTime,
      activityTitle,
      pricePerPerson,
      inviterName,
    } = body;

    if (!pricePerPerson || pricePerPerson <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid price' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Convert dollars to cents
    const priceInCents = Math.round(pricePerPerson * 100);

    // Create the payment link
    const paymentLink = await createPaymentLink({
      priceInCents,
      productName: `${activityTitle} - Trip Ticket`,
      productDescription: `Trip on ${tripDate} at ${tripTime}${inviterName ? `. Invited by ${inviterName}` : ''}`,
      metadata: {
        tripId: tripId || '',
        tripDate: tripDate || '',
        tripTime: tripTime || '',
        inviterName: inviterName || '',
      },
      successUrl: `https://foiltribe.com/booking-success?trip=${tripId}`,
    });

    return new Response(
      JSON.stringify({
        paymentLinkId: paymentLink.id,
        paymentLinkUrl: paymentLink.url,
        tripId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create payment link' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
