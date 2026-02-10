'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';
import { applyPromoCode } from '@/data/activities';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const PHONE_PREFIXES = [
  { code: 'MV', prefix: '+960', flag: '🇲🇻' },
  { code: 'AE', prefix: '+971', flag: '🇦🇪' },
  { code: 'US', prefix: '+1', flag: '🇺🇸' },
  { code: 'GB', prefix: '+44', flag: '🇬🇧' },
  { code: 'DE', prefix: '+49', flag: '🇩🇪' },
  { code: 'FR', prefix: '+33', flag: '🇫🇷' },
  { code: 'ES', prefix: '+34', flag: '🇪🇸' },
  { code: 'IT', prefix: '+39', flag: '🇮🇹' },
  { code: 'IN', prefix: '+91', flag: '🇮🇳' },
  { code: 'LK', prefix: '+94', flag: '🇱🇰' },
  { code: 'TR', prefix: '+90', flag: '🇹🇷' },
  { code: 'QA', prefix: '+974', flag: '🇶🇦' },
  { code: 'SA', prefix: '+966', flag: '🇸🇦' },
  { code: 'AU', prefix: '+61', flag: '🇦🇺' },
  { code: 'SG', prefix: '+65', flag: '🇸🇬' },
  { code: 'MY', prefix: '+60', flag: '🇲🇾' },
  { code: 'CN', prefix: '+86', flag: '🇨🇳' },
  { code: 'JP', prefix: '+81', flag: '🇯🇵' },
  { code: 'KR', prefix: '+82', flag: '🇰🇷' },
  { code: 'RU', prefix: '+7', flag: '🇷🇺' },
  { code: 'BR', prefix: '+55', flag: '🇧🇷' },
  { code: 'ZA', prefix: '+27', flag: '🇿🇦' },
  { code: 'NL', prefix: '+31', flag: '🇳🇱' },
  { code: 'PT', prefix: '+351', flag: '🇵🇹' },
  { code: 'CH', prefix: '+41', flag: '🇨🇭' },
  { code: 'AT', prefix: '+43', flag: '🇦🇹' },
  { code: 'SE', prefix: '+46', flag: '🇸🇪' },
  { code: 'NO', prefix: '+47', flag: '🇳🇴' },
  { code: 'PH', prefix: '+63', flag: '🇵🇭' },
  { code: 'TH', prefix: '+66', flag: '🇹🇭' },
];

export default function CheckoutPage() {
  const { selectedActivity, guestCount, dbTrips } = useStore();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ discount: number; label: string } | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);

  const selectedTrip = dbTrips[0];
  const activity = selectedActivity;
  const pricePerPerson = selectedTrip?.pricePerPerson || activity?.priceFromUsd || 80;

  const subtotal = pricePerPerson * guestCount;
  const discount = appliedPromo ? Math.round(subtotal * appliedPromo.discount) : 0;
  const total = subtotal - discount;
  const totalCents = Math.round(total * 100);

  // Create PaymentIntent on page load
  useEffect(() => {
    if (!activity || totalCents < 50) return;
    setLoadingIntent(true);
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalCents,
        currency: 'usd',
        description: `${activity.title} - ${guestCount} guest(s)`,
        metadata: { activityId: activity.id, guests: String(guestCount) },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        setLoadingIntent(false);
      })
      .catch(() => setLoadingIntent(false));
  }, [activity, totalCents, guestCount]);

  const handleApplyPromo = () => {
    const result = applyPromoCode(promoCode, subtotal);
    if (result) {
      setAppliedPromo({ discount: result.discount / subtotal, label: result.label });
    }
  };

  if (!activity) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No activity selected</h2>
          <Button href="/activities" title="Browse Activities" variant="outline" className="mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <AnimatedDiv animation="fadeIn">
          <BackButton />
          <h1 className="text-2xl font-bold">Checkout</h1>
        </AnimatedDiv>

        {/* Booking summary */}
        <AnimatedDiv animation="fadeIn" delay={100} className="mt-6">
          <div className="rounded-2xl border border-border bg-secondary p-5">
            <h3 className="font-semibold">{activity.title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1"><Icon name="Users" size={14} /> {guestCount} guest{guestCount > 1 ? 's' : ''}</span>
              <span className="flex items-center gap-1"><Icon name="Clock" size={14} /> {activity.durationMin / 60}h</span>
              {selectedTrip && (
                <span className="flex items-center gap-1"><Icon name="Calendar" size={14} /> {selectedTrip.dateLabel} at {selectedTrip.startTime}</span>
              )}
            </div>
          </div>
        </AnimatedDiv>

        {/* Promo code */}
        <AnimatedDiv animation="fadeIn" delay={150} className="mt-6">
          <div className="flex gap-3">
            <input
              type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo code"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none"
            />
            <Button title="Apply" variant="outline" rounded="xl" onPress={handleApplyPromo} />
          </div>
          {appliedPromo && (
            <p className="mt-2 text-sm text-green-500 flex items-center gap-1">
              <Icon name="Check" size={14} /> {appliedPromo.label} applied
            </p>
          )}
        </AnimatedDiv>

        {/* Price summary */}
        <AnimatedDiv animation="fadeIn" delay={200} className="mt-6">
          <div className="rounded-2xl border border-border bg-secondary p-5">
            <h3 className="mb-3 font-semibold">Price Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">${pricePerPerson} x {guestCount} guest{guestCount > 1 ? 's' : ''}</span>
                <span>${subtotal}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-sm text-green-500">
                  <span>Discount</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div className="border-t border-border pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedDiv>

        {/* Stripe Payment */}
        <AnimatedDiv animation="scaleIn" delay={250} className="mt-6">
          {loadingIntent && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-highlight border-t-transparent" />
              <span className="ml-3 text-muted">Preparing checkout...</span>
            </div>
          )}

          {!loadingIntent && clientSecret && stripePromise && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    borderRadius: '12px',
                    fontFamily: 'Outfit, system-ui, sans-serif',
                  },
                },
              }}
            >
              <CheckoutForm
                activity={activity}
                guestCount={guestCount}
                total={total}
              />
            </Elements>
          )}

          {!loadingIntent && !clientSecret && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-muted">Unable to initialize payment. Please try again.</p>
              <Button title="Retry" variant="outline" rounded="xl" className="mt-4" onPress={() => window.location.reload()} />
            </div>
          )}
        </AnimatedDiv>

        <p className="mt-4 text-center text-xs text-muted">
          Free cancellation up to 24 hours before the trip
        </p>
      </div>
    </div>
  );
}

// Checkout form with Express Checkout + PaymentElement (card form)
function CheckoutForm({
  activity,
  guestCount,
  total,
}: {
  activity: { title: string; id: string };
  guestCount: number;
  total: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { addActivityBooking, selectedActivity, activitySlots, selectedActivitySlot } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [expressReady, setExpressReady] = useState(false);
  const [name, setName] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+960');
  const [phoneNumber, setPhoneNumber] = useState('');
  const whatsapp = `${phonePrefix} ${phoneNumber}`.trim();

  const completeBooking = useCallback(() => {
    const slot = selectedActivitySlot || activitySlots[0];
    if (selectedActivity && slot) {
      addActivityBooking(selectedActivity, slot, guestCount, {
        name: name || 'Guest',
        email: '',
        whatsapp,
      });
    }
    router.push('/booking/success');
  }, [selectedActivity, selectedActivitySlot, activitySlots, guestCount, name, whatsapp, addActivityBooking, router]);

  // Handle Express Checkout (Apple Pay / Google Pay) confirm
  const onExpressConfirm = useCallback(async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
    // If no error, Stripe redirects to return_url automatically
  }, [stripe, elements]);

  // Handle manual card form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
        payment_method_data: {
          billing_details: {
            name: name || undefined,
            phone: whatsapp || undefined,
          },
        },
      },
    });

    if (error) {
      // Show error to the customer (e.g., card declined)
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
    // If no error, Stripe redirects to return_url automatically
  };

  return (
    <div className="space-y-6">
      {/* Express Checkout (Apple Pay, Google Pay, Link) - only shows on HTTPS */}
      <div>
        <ExpressCheckoutElement
          onConfirm={onExpressConfirm}
          onReady={({ availablePaymentMethods }) => {
            if (availablePaymentMethods) setExpressReady(true);
          }}
          options={{
            buttonType: { applePay: 'book', googlePay: 'book' },
            buttonHeight: 52,
          }}
        />
      </div>

      {/* Divider - only show if express buttons appeared */}
      {expressReady && (
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or pay with card</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}

      {/* Card payment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">WhatsApp Number</label>
          <div className="flex gap-2">
            <select
              value={phonePrefix}
              onChange={(e) => setPhonePrefix(e.target.value)}
              className="w-28 shrink-0 rounded-xl border border-border bg-background px-3 py-3 text-foreground focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight"
            >
              {PHONE_PREFIXES.map((p) => (
                <option key={p.code} value={p.prefix}>
                  {p.flag} {p.prefix}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9\s]/g, ''))}
              placeholder="Phone number"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-highlight focus:outline-none focus:ring-1 focus:ring-highlight"
            />
          </div>
        </div>

        {/* Stripe PaymentElement - renders the actual card input */}
        <div className="rounded-xl border border-border bg-white p-4">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
            <Icon name="AlertCircle" size={16} />
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full rounded-full bg-highlight py-4 text-center text-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </span>
          ) : (
            `Pay $${total}`
          )}
        </button>
      </form>
    </div>
  );
}

function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
      <Icon name="ArrowLeft" size={16} /> Back
    </button>
  );
}
