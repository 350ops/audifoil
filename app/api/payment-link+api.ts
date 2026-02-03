// Payment Link API Route
// Creates a shareable Stripe Payment Link for inviting friends to join a trip

import { createPaymentLink, CURRENCY } from '@/lib/stripe-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tripId,
      tripDate,
      tripTime,
      activityTitle,
      priceInCents,
      inviterName,
    } = body;

    if (!tripId || !priceInCents) {
      return Response.json(
        { error: 'Missing required fields: tripId, priceInCents' },
        { status: 400 }
      );
    }

    const paymentLink = await createPaymentLink({
      priceInCents,
      productName: `${activityTitle} - Trip Ticket`,
      productDescription: `Join the ${activityTitle} trip on ${tripDate} at ${tripTime}${inviterName ? `. Invited by ${inviterName}` : ''}`,
      tripId,
      tripDate: tripDate || '',
      tripTime: tripTime || '',
      inviterName,
    });

    return Response.json({
      paymentLinkId: paymentLink.id,
      paymentLinkUrl: paymentLink.url,
      tripId,
    });
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    return Response.json(
      { error: error.message || 'Failed to create payment link' },
      { status: 500 }
    );
  }
}
