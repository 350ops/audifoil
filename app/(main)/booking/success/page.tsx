'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><p className="text-muted">Loading...</p></div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const { latestActivityBooking, resetActivitySelection, selectedActivity, activitySlots, selectedActivitySlot, guestCount, addActivityBooking } = useStore();
  const [booking, setBooking] = useState(latestActivityBooking);

  // Handle Stripe redirect - create the booking record after successful payment
  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status');
    const paymentIntent = searchParams.get('payment_intent');

    if (redirectStatus === 'succeeded' && paymentIntent && !latestActivityBooking) {
      // Payment was successful via Stripe redirect - create the booking now
      const slot = selectedActivitySlot || activitySlots[0];
      if (selectedActivity && slot) {
        const newBooking = addActivityBooking(selectedActivity, slot, guestCount, {
          name: 'Guest',
          email: '',
          whatsapp: '',
        });
        setBooking(newBooking);
      }
    } else if (latestActivityBooking) {
      setBooking(latestActivityBooking);
    }
  }, [searchParams, latestActivityBooking]);

  if (!booking) {
    // Check if payment succeeded but we don't have booking details
    const redirectStatus = searchParams.get('redirect_status');
    if (redirectStatus === 'succeeded') {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg text-center">
            <AnimatedDiv animation="scaleIn">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                <Icon name="CheckCircle" size={48} color="#22C55E" />
              </div>
            </AnimatedDiv>
            <AnimatedDiv animation="slideInBottom" delay={100}>
              <h1 className="text-3xl font-bold">Payment Successful!</h1>
              <p className="mt-2 text-lg text-muted">Your booking has been confirmed. We&apos;ll be in touch with details.</p>
            </AnimatedDiv>
            <AnimatedDiv animation="scaleIn" delay={200} className="mt-8">
              <Button href="/explore" title="Back to Home" variant="cta" rounded="full" size="large" />
            </AnimatedDiv>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No booking found</h2>
          <Button href="/explore" title="Go to Home" variant="outline" className="mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <AnimatedDiv animation="scaleIn">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <Icon name="CheckCircle" size={48} color="#22C55E" />
          </div>
        </AnimatedDiv>

        <AnimatedDiv animation="slideInBottom" delay={100}>
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="mt-2 text-lg text-muted">Get ready to fly over paradise</p>
        </AnimatedDiv>

        <AnimatedDiv animation="fadeIn" delay={200}>
          <div className="mt-8 rounded-2xl border border-border bg-secondary p-6 text-left">
            <div className="mb-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted">Confirmation Code</p>
              <p className="mt-1 text-2xl font-bold tracking-wider text-highlight">{booking.confirmationCode}</p>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Experience</span>
                <span className="font-medium">{booking.activity.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Date</span>
                <span className="font-medium">{booking.slot.dateLabel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Time</span>
                <span className="font-medium">{booking.slot.startTime} - {booking.slot.endTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Guests</span>
                <span className="font-medium">{booking.guests}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">${booking.totalPrice}</span>
              </div>
            </div>
          </div>
        </AnimatedDiv>

        <AnimatedDiv animation="fadeIn" delay={300}>
          <div className="mt-6 rounded-2xl border border-border bg-secondary p-5 text-left">
            <h3 className="mb-3 font-semibold">Next Steps</h3>
            <div className="space-y-3 text-sm text-muted">
              <div className="flex items-start gap-3">
                <Icon name="Mail" size={16} className="mt-0.5 shrink-0 text-highlight" />
                <span>A confirmation email has been sent to {booking.userEmail || 'your email'}</span>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="MessageCircle" size={16} className="mt-0.5 shrink-0 text-highlight" />
                <span>We&apos;ll contact you via WhatsApp with pickup details</span>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Share2" size={16} className="mt-0.5 shrink-0 text-highlight" />
                <span>Share the trip with friends — the more who join, the less everyone pays!</span>
              </div>
            </div>
          </div>
        </AnimatedDiv>

        <AnimatedDiv animation="scaleIn" delay={400} className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/bookings" title="View My Bookings" variant="cta" rounded="full" size="large" />
            <Button href="/explore" title="Back to Home" variant="outline" rounded="full" size="large" onPress={resetActivitySelection} />
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
}
