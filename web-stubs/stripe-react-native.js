// Web stub for @stripe/stripe-react-native
// This module has no web support - provide no-op implementations
import React from 'react';
import { View } from 'react-native';

export function StripeProvider({ children }) {
  return children;
}

export async function initPaymentSheet() {
  return { error: { code: 'Unavailable', message: 'Stripe PaymentSheet is not available on web' } };
}

export async function presentPaymentSheet() {
  return { error: { code: 'Unavailable', message: 'Stripe PaymentSheet is not available on web' } };
}

export async function confirmPlatformPayPayment() {
  return { error: { code: 'Unavailable', message: 'Platform Pay is not available on web' } };
}

export function usePlatformPay() {
  return {
    isPlatformPaySupported: false,
    confirmPlatformPayPayment: async () => ({
      error: { code: 'Unavailable', message: 'Platform Pay is not available on web' },
    }),
  };
}

export function PlatformPayButton() {
  return React.createElement(View);
}

export const PlatformPay = {
  ButtonType: {},
  ButtonStyle: {},
};

export function useStripe() {
  return {};
}

export function CardField() {
  return React.createElement(View);
}

export default {
  StripeProvider,
  initPaymentSheet,
  presentPaymentSheet,
  confirmPlatformPayPayment,
  usePlatformPay,
  PlatformPayButton,
  PlatformPay,
};
