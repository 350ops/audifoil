// Trip Status Edge Function
// Returns the current payment status for a group booking

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders } from '../_shared/stripe.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const url = new URL(req.url);
    const bookingId = url.searchParams.get('booking_id');

    if (!bookingId) {
      return new Response(
        JSON.stringify({ error: 'booking_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch booking
    const { data: booking, error: bookingError } = await supabase
      .from('trip_bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch payments
    const { data: payments, error: paymentsError } = await supabase
      .from('trip_payments')
      .select('*')
      .eq('trip_booking_id', bookingId)
      .order('is_booker', { ascending: false })
      .order('paid_at', { ascending: true });

    if (paymentsError) throw paymentsError;

    const paidCount = (payments || []).filter((p: any) => p.status === 'paid').length;
    const pendingCount = (payments || []).filter((p: any) => p.status === 'pending').length;
    const failedCount = (payments || []).filter((p: any) => p.status === 'failed').length;

    return new Response(
      JSON.stringify({
        booking: {
          id: booking.id,
          confirmationCode: booking.confirmation_code,
          activityId: booking.activity_id,
          slotDate: booking.slot_date,
          slotTime: booking.slot_time,
          totalGuests: booking.total_guests,
          pricePerPerson: booking.price_per_person,
          bookerName: booking.booker_name,
          paymentLinkUrl: booking.payment_link_url,
          createdAt: booking.created_at,
        },
        payments: (payments || []).map((p: any) => ({
          id: p.id,
          guestName: p.guest_name,
          guestEmail: p.guest_email,
          amount: p.amount,
          status: p.status,
          isBooker: p.is_booker,
          paidAt: p.paid_at,
        })),
        summary: {
          totalGuests: booking.total_guests,
          paidCount,
          pendingCount,
          failedCount,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching trip status:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch trip status' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
