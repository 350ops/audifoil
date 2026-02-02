// Data module exports
export * from './types';
export * from './flights';
export * from './slots';
export * from './bookings';
export * from './airlineLogos';

// Price constants
export const SLOT_PRICE = 150;
export const CREW_DISCOUNT_PERCENT = 25;
export const CREW_PROMO_CODE = 'CREW25';

// Calculate price with optional promo code
export const calculatePrice = (promoCode?: string): { price: number; discount: number; originalPrice: number } => {
  const originalPrice = SLOT_PRICE;
  
  if (promoCode?.toUpperCase() === CREW_PROMO_CODE) {
    const discount = originalPrice * (CREW_DISCOUNT_PERCENT / 100);
    return {
      price: originalPrice - discount,
      discount,
      originalPrice,
    };
  }
  
  return {
    price: originalPrice,
    discount: 0,
    originalPrice,
  };
};
