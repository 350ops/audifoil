// Stripe Webhook Edge Function
// Handles checkout.session.completed and payment_intent events from Stripe
// Updates trip_payments records when guests pay via shared Payment Links

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

// Verify Stripe signature using Web Crypto API (Deno-native)
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const parts = signature.split(',').reduce((acc: Record<string, string>, part) => {
    const [key, value] = part.split('=');
    acc[key.trim()] = value;
    return acc;
  }, {});

  const timestamp = parts['t'];
  const sig = parts['v1'];

  if (!timestamp || !sig) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signedPayload = `${timestamp}.${payload}`;
  const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
  const computedSig = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return computedSig === sig;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    // Verify webhook signature
    if (webhookSecret && signature) {
      const isValid = await verifyStripeSignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error('Webhook signature verification failed');
        return new Response('Invalid signature', { status: 400 });
      }
    }

    const event = JSON.parse(body);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Webhook received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        // This fires when someone pays via a Payment Link
        const session = event.data.object;
        const metadata = session.metadata || {};
        const tripBookingId = metadata.trip_booking_id;
        const paymentIntentId = session.payment_intent;
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name;

        console.log('Checkout completed for booking:', tripBookingId);

        if (tripBookingId) {
          // Find the first pending payment for this booking and mark it paid
          const { data: pendingPayments } = await supabase
            .from('trip_payments')
            .select('id')
            .eq('trip_booking_id', tripBookingId)
            .eq('status', 'pending')
            .order('created_at', { ascending: true })
            .limit(1);

          if (pendingPayments && pendingPayments.length > 0) {
            await supabase
              .from('trip_payments')
              .update({
                status: 'paid',
                stripe_payment_intent_id: paymentIntentId,
                guest_name: customerName || null,
                guest_email: customerEmail || null,
                paid_at: new Date().toISOString(),
              })
              .eq('id', pendingPayments[0].id);

            console.log(`Payment marked as paid for booking ${tripBookingId}`);
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata || {};
        const tripBookingId = metadata.trip_booking_id;

        if (tripBookingId) {
          const { data: existingPayment } = await supabase
            .from('trip_payments')
            .select('id')
            .eq('stripe_payment_intent_id', paymentIntent.id)
            .limit(1);

          if (existingPayment && existingPayment.length > 0) {
            await supabase
              .from('trip_payments')
              .update({ status: 'paid', paid_at: new Date().toISOString() })
              .eq('id', existingPayment[0].id);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const { data: existingPayment } = await supabase
          .from('trip_payments')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .limit(1);

        if (existingPayment && existingPayment.length > 0) {
          await supabase
            .from('trip_payments')
            .update({ status: 'failed' })
            .eq('id', existingPayment[0].id);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 500 });
  }
});
