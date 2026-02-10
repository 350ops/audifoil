// Create Group Booking Edge Function
// Creates a trip_booking + trip_payments records, and a Stripe Payment Link for remaining guests

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders, createPaymentLink, CURRENCY } from '../_shared/stripe.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'MLD-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();

    const {
      activityId,
      slotDate,
      slotTime,
      totalGuests,
      pricePerPerson = 1, // TESTING: set to $1, change back to $80 for production
      bookerName,
      bookerEmail,
      bookerWhatsapp,
      bookerPaymentIntentId,
      bookerAmount,
    } = body;

    if (!activityId || !slotDate || !slotTime || !totalGuests || !bookerName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const confirmationCode = generateConfirmationCode();

    // 1. Create the trip_booking record
    const { data: booking, error: bookingError } = await supabase
      .from('trip_bookings')
      .insert({
        confirmation_code: confirmationCode,
        activity_id: activityId,
        slot_date: slotDate,
        slot_time: slotTime,
        total_guests: totalGuests,
        price_per_person: pricePerPerson,
        booker_name: bookerName,
        booker_email: bookerEmail || null,
        booker_whatsapp: bookerWhatsapp || null,
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 2. Create payment records
    const payments = [];

    // Booker payment (already paid)
    payments.push({
      trip_booking_id: booking.id,
      guest_name: bookerName,
      guest_email: bookerEmail || null,
      amount: bookerAmount || pricePerPerson,
      stripe_payment_intent_id: bookerPaymentIntentId || null,
      status: 'paid',
      is_booker: true,
      paid_at: new Date().toISOString(),
    });

    // Pending payments for remaining guests
    for (let i = 1; i < totalGuests; i++) {
      payments.push({
        trip_booking_id: booking.id,
        guest_name: null,
        guest_email: null,
        amount: pricePerPerson,
        stripe_payment_intent_id: null,
        status: 'pending',
        is_booker: false,
        paid_at: null,
      });
    }

    const { error: paymentsError } = await supabase
      .from('trip_payments')
      .insert(payments);

    if (paymentsError) throw paymentsError;

    // 3. Create Stripe Payment Link if more than 1 guest
    let paymentLinkUrl = null;
    let paymentLinkId = null;

    if (totalGuests > 1) {
      const priceInCents = Math.round(pricePerPerson * 100);
      const link = await createPaymentLink({
        priceInCents,
        productName: `foiltribe Maldives Adventure — Trip Ticket`,
        productDescription: `Trip on ${slotDate} at ${slotTime}. Booking: ${confirmationCode}`,
        metadata: {
          trip_booking_id: booking.id,
          confirmation_code: confirmationCode,
          slot_date: slotDate,
          slot_time: slotTime,
        },
        successUrl: `https://foiltribe.com/payment-success?booking=${booking.id}`,
      });

      paymentLinkUrl = link.url;
      paymentLinkId = link.id;

      // Update booking with payment link
      await supabase
        .from('trip_bookings')
        .update({
          payment_link_url: paymentLinkUrl,
          payment_link_id: paymentLinkId,
        })
        .eq('id', booking.id);
    }

    return new Response(
      JSON.stringify({
        bookingId: booking.id,
        confirmationCode,
        totalGuests,
        paidCount: 1,
        pendingCount: totalGuests - 1,
        paymentLinkUrl,
        paymentLinkId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error creating group booking:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create group booking' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
