// Stripe Payment Context Provider
// Provides Stripe initialization and payment methods throughout the app

import {
  initPaymentSheet,
  presentPaymentSheet,
  StripeProvider,
} from '@stripe/stripe-react-native';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Get the Supabase Edge Functions URL
function getEdgeFunctionUrl(functionName: string): string {
  return `${SUPABASE_URL}/functions/v1/${functionName}`;
}

// Types
export interface PaymentParams {
  tripId: string;
  amount: number; // in cents
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
  initializePaymentSheet: (params: PaymentParams) => Promise<boolean>;
  presentPaymentSheet: () => Promise<PaymentResult>;
  generateShareableLink: (params: ShareableLinkParams) => Promise<string>;
}

const StripeContext = createContext<StripeContextType | null>(null);

// Mock implementation for when Stripe is not available
const mockStripeContext: StripeContextType = {
  isReady: false,
  isProcessing: false,
  isMockMode: true,
  initializePaymentSheet: async () => {
    Alert.alert('Payment Unavailable', 'Payment system is not configured. Please contact support.');
    return false;
  },
  presentPaymentSheet: async () => ({ success: false, error: 'Payment unavailable' }),
  generateShareableLink: async () => 'https://foiltribe.com',
};

// Hook to use Stripe context
export function useStripePayments() {
  const context = useContext(StripeContext);
  // Return mock if context not available (prevents crash)
  if (!context) {
    console.warn('[Stripe] Context not available, using mock');
    return mockStripeContext;
  }
  return context;
}

// Inner provider that uses the Stripe hooks
function StripePaymentProviderInner({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initialize payment sheet with Supabase Edge Function
  const handleInitializePaymentSheet = useCallback(async (params: PaymentParams): Promise<boolean> => {
    console.log('[Stripe] Initializing payment sheet...');
    setIsProcessing(true);

    try {
      // Call Supabase Edge Function
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
        console.error('[Stripe] API error:', errorData);
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const { paymentIntent, ephemeralKey, customer } = await response.json();
      console.log('[Stripe] Got payment intent, initializing sheet...');

      // Initialize the payment sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'foiltribe',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: params.customerName,
          email: params.customerEmail,
        },
        returnURL: 'foiltribe://stripe-redirect',
      });

      if (error) {
        console.error('[Stripe] initPaymentSheet error:', error);
        Alert.alert('Error', error.message);
        setIsProcessing(false);
        return false;
      }

      console.log('[Stripe] Payment sheet initialized successfully');
      setIsReady(true);
      setIsProcessing(false);
      return true;
    } catch (error: any) {
      console.error('[Stripe] Error in initializePaymentSheet:', error);
      Alert.alert('Payment Error', error.message || 'Failed to initialize payment. Please try again.');
      setIsProcessing(false);
      return false;
    }
  }, []);

  // Present the payment sheet
  const handlePresentPaymentSheet = useCallback(async (): Promise<PaymentResult> => {
    console.log('[Stripe] Presenting payment sheet...');
    setIsProcessing(true);

    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        console.log('[Stripe] Payment cancelled or failed:', error.message);
        setIsProcessing(false);

        if (error.code === 'Canceled') {
          return { success: false, error: 'Payment cancelled' };
        }

        return { success: false, error: error.message };
      }

      console.log('[Stripe] Payment successful!');
      setIsReady(false);
      setIsProcessing(false);
      return { success: true, paymentIntentId: `pi_${Date.now()}` };
    } catch (error: any) {
      console.error('[Stripe] Error presenting payment sheet:', error);
      setIsProcessing(false);
      return { success: false, error: 'Payment failed' };
    }
  }, []);

  // Generate a shareable payment link for friends via Supabase Edge Function
  const generateShareableLink = useCallback(async (params: ShareableLinkParams): Promise<string> => {
    console.log('[Stripe] Generating shareable link...');

    try {
      const response = await fetch(getEdgeFunctionUrl('payment-link'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          tripId: params.tripId,
          tripDate: params.tripDate,
          tripTime: params.tripTime,
          activityTitle: params.activityTitle,
          pricePerPerson: params.pricePerPerson,
          inviterName: params.inviterName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create payment link');
      }

      const { paymentLinkUrl } = await response.json();
      console.log('[Stripe] Payment link created:', paymentLinkUrl);
      return paymentLinkUrl;
    } catch (error: any) {
      console.error('[Stripe] Error creating payment link:', error);
      // Return a fallback deep link
      const queryParams = new URLSearchParams({
        trip: params.tripId,
        date: params.tripDate,
        time: params.tripTime,
        activity: params.activityTitle,
        price: params.pricePerPerson.toString(),
      });
      return `https://foiltribe.com/join?${queryParams.toString()}`;
    }
  }, []);

  const value: StripeContextType = {
    isReady,
    isProcessing,
    isMockMode: false,
    initializePaymentSheet: handleInitializePaymentSheet,
    presentPaymentSheet: handlePresentPaymentSheet,
    generateShareableLink,
  };

  return <StripeContext.Provider value={value}>{children}</StripeContext.Provider>;
}

// Main provider that wraps children with StripeProvider
export default function StripePaymentProvider({ children }: { children: React.ReactNode }) {
  if (!PUBLISHABLE_KEY) {
    console.warn('[Stripe] Missing EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY - payments disabled');
    // Still provide context with mock implementation
    return (
      <StripeContext.Provider value={mockStripeContext}>
        {children}
      </StripeContext.Provider>
    );
  }

  try {
    return (
      <StripeProvider
        publishableKey={PUBLISHABLE_KEY}
        urlScheme="foiltribe"
        merchantIdentifier="merchant.com.mmdev13.foiltribemv"
      >
        <StripePaymentProviderInner>{children}</StripePaymentProviderInner>
      </StripeProvider>
    );
  } catch (error) {
    console.error('[Stripe] Failed to initialize StripeProvider:', error);
    // Fallback to mock if native module fails
    return (
      <StripeContext.Provider value={mockStripeContext}>
        {children}
      </StripeContext.Provider>
    );
  }
}

// Helper function to convert dollars to cents
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

// Helper function to format price for display
export function formatStripePrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
