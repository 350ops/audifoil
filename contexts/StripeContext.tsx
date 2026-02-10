'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cikeyqrsslkczzzklixf.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpa2V5cXJzc2xrY3p6emtsaXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQwNTMsImV4cCI6MjA4NDc5MDA1M30.-aV3veBqpf6Yv3jdE43q0ZRZKR-MGn6P036KBQymvNE';

function getEdgeFunctionUrl(functionName: string): string {
  return `${SUPABASE_URL}/functions/v1/${functionName}`;
}

const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;

export interface PaymentParams {
  tripId: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
  clientSecret?: string;
}

export interface ShareableLinkParams {
  tripId: string;
  tripDate: string;
  tripTime: string;
  activityTitle: string;
  pricePerPerson: number;
  inviterName?: string;
}

interface StripeContextType {
  isReady: boolean;
  isProcessing: boolean;
  isMockMode: boolean;
  clientSecret: string | null;
  initializePayment: (params: PaymentParams) => Promise<string | null>;
  generateShareableLink: (params: ShareableLinkParams) => Promise<string>;
}

const StripeContext = createContext<StripeContextType | null>(null);

const mockStripeContext: StripeContextType = {
  isReady: false,
  isProcessing: false,
  isMockMode: true,
  clientSecret: null,
  initializePayment: async () => {
    alert('Payment system is not configured. Please contact support.');
    return null;
  },
  generateShareableLink: async () => 'https://bohowaves.com',
};

export function useStripePayments() {
  const context = useContext(StripeContext);
  if (!context) return mockStripeContext;
  return context;
}

function StripePaymentProviderInner({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const initializePayment = useCallback(async (params: PaymentParams): Promise<string | null> => {
    setIsProcessing(true);
    try {
      const response = await fetch(getEdgeFunctionUrl('payment-sheet'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          amount: params.amount,
          currency: params.currency || 'usd',
          customerEmail: params.customerEmail,
          customerName: params.customerName,
          description: params.description,
          tripId: params.tripId,
          metadata: params.metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const { paymentIntent } = await response.json();
      setClientSecret(paymentIntent);
      setIsReady(true);
      setIsProcessing(false);
      return paymentIntent;
    } catch (error: any) {
      console.error('[Stripe] Error:', error);
      setIsProcessing(false);
      return null;
    }
  }, []);

  const generateShareableLink = useCallback(async (params: ShareableLinkParams): Promise<string> => {
    try {
      const response = await fetch(getEdgeFunctionUrl('payment-link'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Failed to create payment link');
      const { paymentLinkUrl } = await response.json();
      return paymentLinkUrl;
    } catch {
      const queryParams = new URLSearchParams({ trip: params.tripId, date: params.tripDate, time: params.tripTime, activity: params.activityTitle, price: params.pricePerPerson.toString() });
      return `https://bohowaves.com/join?${queryParams.toString()}`;
    }
  }, []);

  return (
    <StripeContext.Provider value={{ isReady, isProcessing, isMockMode: false, clientSecret, initializePayment, generateShareableLink }}>
      {children}
    </StripeContext.Provider>
  );
}

export default function StripePaymentProvider({ children }: { children: React.ReactNode }) {
  if (!stripePromise) {
    return <StripeContext.Provider value={mockStripeContext}>{children}</StripeContext.Provider>;
  }

  return (
    <Elements stripe={stripePromise}>
      <StripePaymentProviderInner>{children}</StripePaymentProviderInner>
    </Elements>
  );
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}
