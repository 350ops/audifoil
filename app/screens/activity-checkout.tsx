import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { useStripePayments, dollarsToCents } from '@/contexts/StripeContext';
import {
  PlatformPayButton,
  PlatformPay,
  usePlatformPay,
  confirmPlatformPayPayment,
} from '@stripe/stripe-react-native';
import {
  getSingleTicketPrice,
  getFriendInviteInfo,
  MIN_GUESTS_FOR_BASE_PRICE,
} from '@/data/pricing';
import { applyPromoCode, EFOIL_ADDON, MALDIVES_ADVENTURE_ID } from '@/data/activities';

export default function ActivityCheckoutScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const {
    selectedActivity,
    selectedActivitySlot,
    guestCount,
    addActivityBooking,
    updateActivityBooking,
    demoUser,
    dbTrips,
  } = useStore();

  // Stripe payment hooks
  const { isProcessing, initializePaymentSheet, presentPaymentSheet } = useStripePayments();

  // Form state
  const [name, setName] = useState(demoUser?.name || '');
  const [email, setEmail] = useState(demoUser?.email || '');
  const [whatsapp, setWhatsapp] = useState(demoUser?.whatsapp || '');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ discount: number; label: string } | null>(null);

  // Validation state
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});

  // E-Foil add-on state
  const [efoilCount, setEfoilCount] = useState(0);
  const isMaldivesAdventure = selectedActivity?.id === MALDIVES_ADVENTURE_ID;
  const efoilTotal = efoilCount * EFOIL_ADDON.priceUsd;

  // Apple Pay
  const { isPlatformPaySupported } = usePlatformPay();
  const [applePaySupported, setApplePaySupported] = useState(false);

  // Check Apple Pay support on mount
  React.useEffect(() => {
    (async () => {
      try {
        const supported = await isPlatformPaySupported({ googlePay: { testEnv: false } });
        setApplePaySupported(supported);
        console.log('[ApplePay] Supported:', supported);
      } catch (e) {
        console.log('[ApplePay] Check failed, defaulting to true on iOS:', e);
        // On iOS, default to showing Apple Pay — it will handle errors gracefully
        if (Platform.OS === 'ios') {
          setApplePaySupported(true);
        }
      }
    })();
  }, [isPlatformPaySupported]);

  // Payment state
  const [paymentStep, setPaymentStep] = useState<'idle' | 'initializing' | 'ready' | 'processing' | 'success' | 'error'>('idle');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [showInviteSection, setShowInviteSection] = useState(false);

  // Get trip info
  const tripInfo = useMemo(() => {
    if (!selectedActivitySlot || !selectedActivity) return null;

    const dbTrip = dbTrips.find((t) => t.id === selectedActivitySlot.id);
    const bookedCount = dbTrip?.bookedCount ?? 0;
    const maxCapacity = selectedActivity.maxGuests;

    return {
      bookedCount,
      maxCapacity,
      spotsRemaining: maxCapacity - bookedCount,
      needsMorePeople: bookedCount + guestCount < MIN_GUESTS_FOR_BASE_PRICE,
      friendsNeeded: Math.max(0, MIN_GUESTS_FOR_BASE_PRICE - bookedCount - guestCount),
    };
  }, [selectedActivitySlot, selectedActivity, dbTrips, guestCount]);

  // Split payment: booker only pays their own ticket + personal e-foil
  const ticketPrice = getSingleTicketPrice(); // $80
  const bookerTicket = ticketPrice; // Just 1 ticket for the booker
  const bookerEfoil = efoilCount > 0 ? EFOIL_ADDON.priceUsd : 0; // Booker's personal e-foil only
  const bookerTotal = bookerTicket + bookerEfoil;
  const finalPrice = promoApplied
    ? bookerTotal - promoApplied.discount
    : bookerTotal;
  const actualDiscount = bookerTotal - finalPrice;
  const remainingGuests = guestCount - 1;

  // Get friend invite info (safe even if activity is null)
  const inviteInfo = useMemo(() => {
    if (!selectedActivity || !selectedActivitySlot) return null;
    return getFriendInviteInfo(
      tripInfo?.bookedCount ?? 0,
      selectedActivity.maxGuests,
      selectedActivity.title,
      selectedActivitySlot.dateLabel,
      selectedActivitySlot.startTime
    );
  }, [selectedActivity, selectedActivitySlot, tripInfo?.bookedCount]);

  // Validation functions
  const validateEmail = useCallback((emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, validateEmail]);

  const handleBlur = useCallback((field: 'name' | 'email') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'name') {
      setErrors((prev) => ({ ...prev, name: !name.trim() ? 'Name is required' : undefined }));
    }
    if (field === 'email') {
      if (!email.trim()) setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      else if (!validateEmail(email)) setErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }));
      else setErrors((prev) => ({ ...prev, email: undefined }));
    }
  }, [name, email, validateEmail]);

  const handleApplyPromo = useCallback(() => {
    const result = applyPromoCode(promoCode, bookerTotal);
    if (result) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPromoApplied({ discount: result.discount, label: result.label });
    } else if (promoCode.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Code', 'This promo code is not valid. Try CREW25 for a crew discount!');
    }
  }, [promoCode, bookerTotal]);

  // Initialize Stripe Payment Sheet
  const initPayment = useCallback(async () => {
    if (!selectedActivity || !selectedActivitySlot) return false;
    
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTouched({ name: true, email: true });
      return false;
    }

    setPaymentStep('initializing');
    setShowPaymentModal(true);

    const success = await initializePaymentSheet({
      tripId: selectedActivitySlot.id,
      amount: dollarsToCents(finalPrice),
      currency: 'usd',
      customerEmail: email,
      customerName: name,
      description: `${selectedActivity.title} - ${selectedActivitySlot.dateLabel} at ${selectedActivitySlot.startTime}`,
      metadata: {
        activityId: selectedActivity.id,
        tripDate: selectedActivitySlot.date,
        tripTime: selectedActivitySlot.startTime,
        guestCount: guestCount.toString(),
      },
    });

    if (success) {
      setPaymentStep('ready');
      return true;
    } else {
      setPaymentStep('error');
      return false;
    }
  }, [selectedActivity, selectedActivitySlot, email, name, finalPrice, guestCount, initializePaymentSheet, validateForm]);

  // Create group booking after payment succeeds
  const createGroupBooking = useCallback(async (paymentIntentId?: string) => {
    if (!selectedActivity || !selectedActivitySlot) return null;

    try {
      const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-group-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_KEY}`,
          apikey: SUPABASE_KEY!,
        },
        body: JSON.stringify({
          activityId: selectedActivity.id,
          slotDate: selectedActivitySlot.date,
          slotTime: selectedActivitySlot.startTime,
          totalGuests: guestCount,
          pricePerPerson: ticketPrice,
          bookerName: name,
          bookerEmail: email,
          bookerWhatsapp: whatsapp,
          bookerPaymentIntentId: paymentIntentId || null,
          bookerAmount: finalPrice,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('[GroupBooking] Error:', err);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('[GroupBooking] Failed:', error);
      return null;
    }
  }, [selectedActivity, selectedActivitySlot, guestCount, ticketPrice, name, email, whatsapp, finalPrice]);

  // Handle payment
  // TESTING: Set to true to skip Stripe and simulate a successful payment
  const SIMULATE_PAYMENT = __DEV__;

  const handlePayment = useCallback(async () => {
    if (!selectedActivity || !selectedActivitySlot) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTouched({ name: true, email: true });
      return;
    }

    // TESTING: Simulate successful payment in dev mode
    if (SIMULATE_PAYMENT) {
      setPaymentStep('processing');
      setShowPaymentModal(true);

      // Simulate a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = { success: true, paymentIntentId: `pi_test_${Date.now()}` } as any;

      setPaymentStep('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const localBooking = await addActivityBooking(selectedActivity, selectedActivitySlot, guestCount, {
        name, email, whatsapp,
      });

      const groupBooking = await createGroupBooking(result.paymentIntentId);

      if (groupBooking && localBooking) {
        await updateActivityBooking(localBooking.id, {
          supabaseBookingId: groupBooking.bookingId,
          paymentLinkUrl: groupBooking.paymentLinkUrl,
          paidCount: 1,
          confirmationCode: groupBooking.confirmationCode || localBooking.confirmationCode,
        });
      }

      setTimeout(() => {
        setShowPaymentModal(false);
        router.replace({
          pathname: '/screens/activity-success',
          params: {
            paymentLinkUrl: groupBooking?.paymentLinkUrl || '',
            bookingId: groupBooking?.bookingId || '',
            pendingCount: String(groupBooking?.pendingCount || 0),
          },
        });
      }, 1500);

      return;
    }

    // Production: real Stripe payment
    // Initialize payment if not already done
    if (paymentStep !== 'ready') {
      const initialized = await initPayment();
      if (!initialized) return;
    }

    setPaymentStep('processing');

    const result = await presentPaymentSheet();

    if (result.success) {
      setPaymentStep('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Create local booking record
      const localBooking = await addActivityBooking(selectedActivity, selectedActivitySlot, guestCount, {
        name,
        email,
        whatsapp,
      });

      // Create group booking in Supabase (for payment tracking)
      const groupBooking = await createGroupBooking(result.paymentIntentId);

      // Save group booking info back to local booking
      if (groupBooking && localBooking) {
        await updateActivityBooking(localBooking.id, {
          supabaseBookingId: groupBooking.bookingId,
          paymentLinkUrl: groupBooking.paymentLinkUrl,
          paidCount: 1,
          confirmationCode: groupBooking.confirmationCode || localBooking.confirmationCode,
        });
      }

      // Show success for a moment then navigate
      setTimeout(() => {
        setShowPaymentModal(false);
        router.replace({
          pathname: '/screens/activity-success',
          params: {
            paymentLinkUrl: groupBooking?.paymentLinkUrl || '',
            bookingId: groupBooking?.bookingId || '',
            pendingCount: String(groupBooking?.pendingCount || 0),
          },
        });
      }, 1500);
    } else {
      setPaymentStep('error');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      if (result.error !== 'Payment cancelled') {
        Alert.alert('Payment Failed', result.error || 'Something went wrong. Please try again.');
      }
      
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentStep('idle');
      }, 500);
    }
  }, [selectedActivity, selectedActivitySlot, paymentStep, initPayment, presentPaymentSheet, addActivityBooking, guestCount, name, email, whatsapp]);

  // Handle Apple Pay
  const handleApplePay = useCallback(async () => {
    if (!selectedActivity || !selectedActivitySlot) return;

    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTouched({ name: true, email: true });
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPaymentStep('processing');
    setShowPaymentModal(true);

    try {
      // First get the payment intent from the server
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/payment-sheet`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({
            amount: dollarsToCents(finalPrice),
            currency: 'usd',
            customerEmail: email,
            customerName: name,
            description: `${selectedActivity.title} - ${selectedActivitySlot.dateLabel} at ${selectedActivitySlot.startTime}`,
            tripId: selectedActivitySlot.id,
            metadata: {
              activityId: selectedActivity.id,
              tripDate: selectedActivitySlot.date,
              tripTime: selectedActivitySlot.startTime,
              guestCount: guestCount.toString(),
            },
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create payment intent');
      const { paymentIntent: clientSecret } = await response.json();

      // Confirm with Apple Pay
      const { error } = await confirmPlatformPayPayment(clientSecret, {
        applePay: {
          cartItems: [
            {
              label: selectedActivity.title,
              amount: finalPrice.toFixed(2),
              paymentType: PlatformPay.PaymentType.Immediate,
            },
          ],
          merchantCountryCode: 'US',
          currencyCode: 'USD',
        },
      });

      if (error) {
        if (error.code === 'Canceled') {
          setPaymentStep('idle');
          setShowPaymentModal(false);
          return;
        }
        throw new Error(error.message);
      }

      // Success
      setPaymentStep('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const localBooking = await addActivityBooking(selectedActivity, selectedActivitySlot, guestCount, {
        name,
        email,
        whatsapp,
      });

      // Create group booking in Supabase
      const groupBooking = await createGroupBooking();

      if (groupBooking && localBooking) {
        await updateActivityBooking(localBooking.id, {
          supabaseBookingId: groupBooking.bookingId,
          paymentLinkUrl: groupBooking.paymentLinkUrl,
          paidCount: 1,
          confirmationCode: groupBooking.confirmationCode || localBooking.confirmationCode,
        });
      }

      setTimeout(() => {
        setShowPaymentModal(false);
        router.replace({
          pathname: '/screens/activity-success',
          params: {
            paymentLinkUrl: groupBooking?.paymentLinkUrl || '',
            bookingId: groupBooking?.bookingId || '',
            pendingCount: String(groupBooking?.pendingCount || 0),
          },
        });
      }, 1500);
    } catch (error: any) {
      setPaymentStep('error');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Payment Failed', error.message || 'Something went wrong. Please try again.');
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentStep('idle');
      }, 500);
    }
  }, [selectedActivity, selectedActivitySlot, finalPrice, email, name, whatsapp, guestCount, validateForm, addActivityBooking]);

  // Generate shareable link for friends
  const generateShareLink = useCallback(async () => {
    if (!selectedActivity || !selectedActivitySlot) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await fetch('/api/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: selectedActivitySlot.id,
          tripDate: selectedActivitySlot.dateLabel,
          tripTime: selectedActivitySlot.startTime,
          activityTitle: selectedActivity.title,
          priceInCents: dollarsToCents(ticketPrice),
          inviterName: name || 'A friend',
        }),
      });

      if (response.ok) {
        const { paymentLinkUrl } = await response.json();
        setShareableLink(paymentLinkUrl);
        setShowInviteSection(true);
      } else {
        // Fallback to app deep link
        const fallbackLink = `foiltribe://join?trip=${selectedActivitySlot.id}&price=${ticketPrice}`;
        setShareableLink(fallbackLink);
        setShowInviteSection(true);
      }
    } catch {
      // Fallback link
      const fallbackLink = `https://foiltribe.com/join?trip=${selectedActivitySlot.id}&price=${ticketPrice}`;
      setShareableLink(fallbackLink);
      setShowInviteSection(true);
    }
  }, [selectedActivity, selectedActivitySlot, ticketPrice, name]);

  // Share with friends
  const handleShare = useCallback(async () => {
    if (!selectedActivity || !inviteInfo) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const message = inviteInfo.shareMessage + (shareableLink ? `\n\nBook here: ${shareableLink}` : '');
    
    try {
      await Share.share({
        message,
        title: `Join me on ${selectedActivity.title}!`,
      });
    } catch {
      // Share cancelled or failed
    }
  }, [selectedActivity, inviteInfo, shareableLink]);

  // Copy link
  const handleCopyLink = useCallback(async () => {
    if (shareableLink) {
      await Clipboard.setStringAsync(shareableLink);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Copied!', 'Payment link copied to clipboard');
    }
  }, [shareableLink]);

  const isFormValid = name.trim().length > 0 && email.trim().length > 0;

  // Early return if no selection - redirect back to activities
  if (!selectedActivity || !selectedActivitySlot) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Icon name="AlertCircle" size={48} color={colors.textMuted} />
        <ThemedText className="mt-4 text-lg font-semibold">Booking Session Expired</ThemedText>
        <ThemedText className="mt-2 text-center" style={{ color: colors.textMuted }}>
          Your booking session has expired or was not properly initialized. Please try again.
        </ThemedText>
        <Button 
          title="Go Back" 
          onPress={() => router.replace('/(drawer)/(tabs)')} 
          className="mt-6"
          iconStart="ArrowLeft"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Checkout" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Booking Summary */}
          <View className="pt-4">
            <AnimatedView animation="scaleIn">
              <View className="bg-secondary rounded-2xl overflow-hidden" style={shadowPresets.card}>
                <View className="p-4 flex-row items-center">
                  <View
                    className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: colors.highlight + '15' }}
                  >
                    <Icon name="Waves" size={28} color={colors.highlight} />
                  </View>
                  <View className="flex-1">
                    <ThemedText className="font-bold text-lg">{selectedActivity.title}</ThemedText>
                    <ThemedText className="opacity-50">
                      {selectedActivitySlot.dateLabel} · {selectedActivitySlot.startTime}
                    </ThemedText>
                  </View>
                </View>
                <View className="px-4 pb-4 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Icon name="User" size={16} color={colors.placeholder} />
                    <ThemedText className="ml-2 opacity-60">
                      {guestCount} ticket{guestCount !== 1 ? 's' : ''}
                    </ThemedText>
                  </View>
                  <View className="flex-row items-center">
                    <Icon name="Clock" size={16} color={colors.placeholder} />
                    <ThemedText className="ml-2 opacity-60">{selectedActivity.durationMin} min</ThemedText>
                  </View>
                </View>
              </View>
            </AnimatedView>
          </View>

          {/* Pricing Notice - Single Ticket Model */}
          <View className="mt-6">
            <AnimatedView animation="scaleIn" delay={50}>
              <View
                className="bg-secondary rounded-2xl p-4"
                style={[shadowPresets.card, { borderWidth: 1, borderColor: colors.highlight + '30' }]}
              >
                <View className="flex-row items-center mb-3">
                  <Icon name="Ticket" size={20} color={colors.highlight} />
                  <ThemedText className="font-bold text-lg ml-2">Your Ticket</ThemedText>
                </View>

                <View className="flex-row items-baseline">
                  <ThemedText className="text-3xl font-bold" style={{ color: colors.highlight }}>
                    ${ticketPrice}
                  </ThemedText>
                  <ThemedText className="ml-2 opacity-60">/person</ThemedText>
                </View>

                <ThemedText className="mt-2 text-sm" style={{ color: colors.textMuted }}>
                  You pay for your ticket only. Invite friends to join - they'll pay for their own tickets.
                </ThemedText>

                {tripInfo && tripInfo.needsMorePeople && (
                  <View className="mt-4 p-3 rounded-xl" style={{ backgroundColor: colors.highlight + '10' }}>
                    <View className="flex-row items-center">
                      <Icon name="Users" size={16} color={colors.highlight} />
                      <ThemedText className="ml-2 text-sm" style={{ color: colors.highlight }}>
                        {tripInfo.friendsNeeded} more {tripInfo.friendsNeeded === 1 ? 'person' : 'people'} needed to fill the group
                      </ThemedText>
                    </View>
                  </View>
                )}
              </View>
            </AnimatedView>
          </View>

          {/* Contact Details */}
          <View className="mt-6">
            <ThemedText className="text-xl font-bold mb-4">Contact Details</ThemedText>

            <View className="gap-4">
              <FormInput
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (touched.name && text.trim()) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                onBlur={() => handleBlur('name')}
                icon="User"
                required
                error={touched.name ? errors.name : undefined}
              />
              <FormInput
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (touched.email && validateEmail(text)) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onBlur={() => handleBlur('email')}
                icon="Mail"
                keyboardType="email-address"
                required
                error={touched.email ? errors.email : undefined}
              />
              <FormInput
                label="WhatsApp"
                placeholder="+1 234 567 8900"
                value={whatsapp}
                onChangeText={setWhatsapp}
                icon="MessageCircle"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Promo Code */}
          <View className="mt-6">
            <ThemedText className="font-bold mb-3">Promo Code</ThemedText>
            <View className="flex-row gap-3">
              <View
                className="flex-1 bg-secondary rounded-xl px-4 py-3 flex-row items-center"
                style={shadowPresets.small}
              >
                <Icon name="Ticket" size={20} color={colors.placeholder} />
                <TextInput
                  value={promoCode}
                  onChangeText={setPromoCode}
                  placeholder="Enter code (try CREW25)"
                  placeholderTextColor={colors.placeholder}
                  className="flex-1 ml-3"
                  style={{ color: colors.text }}
                  autoCapitalize="characters"
                  editable={!promoApplied}
                />
                {promoApplied && <Icon name="Check" size={20} color="#22C55E" />}
              </View>
              {!promoApplied && (
                <Pressable
                  onPress={handleApplyPromo}
                  className="bg-highlight rounded-xl px-5 items-center justify-center"
                >
                  <ThemedText className="text-white font-semibold">Apply</ThemedText>
                </Pressable>
              )}
            </View>
            {promoApplied && (
              <ThemedText className="text-sm mt-2" style={{ color: '#22C55E' }}>
                {promoApplied.label} applied!
              </ThemedText>
            )}
          </View>

          {/* E-Foil Add-on */}
          {isMaldivesAdventure && (
            <View className="mt-6">
              <AnimatedView animation="scaleIn" delay={80}>
                <View
                  className="bg-secondary rounded-2xl overflow-hidden"
                  style={[shadowPresets.card, efoilCount > 0 ? { borderWidth: 2, borderColor: colors.highlight } : {}]}
                >
                  <View className="p-4">
                    <View className="flex-row items-center mb-2">
                      <Icon name="Zap" size={20} color={colors.highlight} />
                      <ThemedText className="font-bold text-lg ml-2">{EFOIL_ADDON.title}</ThemedText>
                    </View>

                    <ThemedText className="text-sm mb-3" style={{ color: colors.textMuted }}>
                      {EFOIL_ADDON.description}
                    </ThemedText>

                    <View className="flex-row items-center justify-between">
                      <View>
                        <ThemedText className="font-bold text-lg" style={{ color: colors.highlight }}>
                          ${EFOIL_ADDON.priceUsd}
                        </ThemedText>
                        <ThemedText className="text-sm" style={{ color: colors.textMuted }}>
                          per person · {EFOIL_ADDON.durationLabel}
                        </ThemedText>
                      </View>

                      <View className="flex-row items-center gap-3">
                        <Pressable
                          onPress={() => {
                            if (efoilCount > 0) {
                              Haptics.selectionAsync();
                              setEfoilCount(efoilCount - 1);
                            }
                          }}
                          className="w-9 h-9 rounded-full items-center justify-center"
                          style={{ backgroundColor: efoilCount > 0 ? colors.highlight + '20' : colors.border }}
                        >
                          <Icon name="Minus" size={16} color={efoilCount > 0 ? colors.highlight : colors.textMuted} />
                        </Pressable>

                        <ThemedText className="font-bold text-lg" style={{ minWidth: 24, textAlign: 'center' }}>
                          {efoilCount}
                        </ThemedText>

                        <Pressable
                          onPress={() => {
                            if (efoilCount < guestCount) {
                              Haptics.selectionAsync();
                              setEfoilCount(efoilCount + 1);
                            }
                          }}
                          className="w-9 h-9 rounded-full items-center justify-center"
                          style={{ backgroundColor: efoilCount < guestCount ? colors.highlight + '20' : colors.border }}
                        >
                          <Icon name="Plus" size={16} color={efoilCount < guestCount ? colors.highlight : colors.textMuted} />
                        </Pressable>
                      </View>
                    </View>

                    {efoilCount > 0 && (
                      <View className="mt-3 pt-3 border-t border-border flex-row items-center justify-between">
                        <ThemedText className="text-sm" style={{ color: colors.textMuted }}>
                          {efoilCount} × ${EFOIL_ADDON.priceUsd}
                        </ThemedText>
                        <ThemedText className="font-bold" style={{ color: colors.highlight }}>
                          ${efoilTotal}
                        </ThemedText>
                      </View>
                    )}

                    {efoilCount === 0 && (
                      <ThemedText className="text-xs mt-2 italic opacity-40">
                        You can also add this after booking — anytime before the trip.
                      </ThemedText>
                    )}
                  </View>
                </View>
              </AnimatedView>
            </View>
          )}

          {/* Invite Friends Section */}
          {tripInfo && tripInfo.needsMorePeople && (
            <View className="mt-6">
              <AnimatedView animation="scaleIn" delay={100}>
                <View className="bg-secondary rounded-2xl overflow-hidden" style={shadowPresets.card}>
                  <View className="p-4">
                    <View className="flex-row items-center mb-3">
                      <Icon name="Share2" size={20} color={colors.highlight} />
                      <ThemedText className="font-bold text-lg ml-2">Invite Friends</ThemedText>
                    </View>

                    <ThemedText className="mb-4" style={{ color: colors.textMuted }}>
                      Share a payment link with friends so they can book their own tickets and join your trip.
                    </ThemedText>

                    {!showInviteSection ? (
                      <Button
                        title="Generate Invite Link"
                        iconStart="Link"
                        variant="outline"
                        onPress={generateShareLink}
                      />
                    ) : (
                      <View className="gap-3">
                        {shareableLink && (
                          <View
                            className="bg-background rounded-xl p-3 flex-row items-center"
                            style={{ borderWidth: 1, borderColor: colors.border }}
                          >
                            <ThemedText className="flex-1 text-sm" numberOfLines={1}>
                              {shareableLink}
                            </ThemedText>
                            <Pressable onPress={handleCopyLink} className="ml-2 p-2">
                              <Icon name="Copy" size={18} color={colors.highlight} />
                            </Pressable>
                          </View>
                        )}

                        <View className="flex-row gap-3">
                          <Button
                            title="Share"
                            iconStart="Share"
                            variant="primary"
                            onPress={handleShare}
                            className="flex-1"
                          />
                          <Button
                            title="Copy"
                            iconStart="Copy"
                            variant="outline"
                            onPress={handleCopyLink}
                            className="flex-1"
                          />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </AnimatedView>
            </View>
          )}

          {/* Price Summary — split model */}
          <View className="mt-6">
            <ThemedText className="font-bold text-lg mb-3">Your Payment</ThemedText>
            <View className="bg-secondary rounded-xl p-4" style={shadowPresets.card}>
              <View className="flex-row justify-between mb-3">
                <ThemedText className="opacity-60">Your ticket</ThemedText>
                <ThemedText className="font-medium">${ticketPrice}</ThemedText>
              </View>
              {bookerEfoil > 0 && (
                <View className="flex-row justify-between mb-3">
                  <ThemedText className="opacity-60">E-Foil add-on</ThemedText>
                  <ThemedText className="font-medium">${bookerEfoil}</ThemedText>
                </View>
              )}
              {promoApplied && (
                <View className="flex-row justify-between mb-3">
                  <ThemedText style={{ color: '#22C55E' }}>{promoApplied.label}</ThemedText>
                  <ThemedText className="font-medium" style={{ color: '#22C55E' }}>
                    -${actualDiscount.toFixed(2)}
                  </ThemedText>
                </View>
              )}
              <View className="flex-row justify-between pt-3 border-t border-border">
                <ThemedText className="font-bold text-lg">You pay</ThemedText>
                <ThemedText className="font-bold text-2xl" style={{ color: colors.highlight }}>
                  ${finalPrice.toFixed(2)}
                </ThemedText>
              </View>
            </View>

            {/* Split payment info */}
            {remainingGuests > 0 && (
              <View className="mt-3 rounded-xl p-3" style={{ backgroundColor: colors.highlight + '10' }}>
                <View className="flex-row items-start">
                  <Icon name="Users" size={16} color={colors.highlight} />
                  <View className="ml-2 flex-1">
                    <ThemedText className="text-sm font-medium" style={{ color: colors.highlight }}>
                      {remainingGuests} more {remainingGuests === 1 ? 'guest' : 'guests'} to pay separately
                    </ThemedText>
                    <ThemedText className="text-xs mt-1 opacity-60">
                      After you pay, you'll get a payment link (${ticketPrice}/person) to share with your group.
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* What's Included */}
          <View className="mt-6 mb-8">
            <ThemedText className="font-bold text-lg mb-3">What's Included</ThemedText>
            <View className="bg-secondary rounded-xl p-4" style={shadowPresets.card}>
              {selectedActivity.included.slice(0, 4).map((item, i) => (
                <View key={i} className={`flex-row items-center ${i < 3 ? 'mb-3' : ''}`}>
                  <View className="w-6 h-6 rounded-full bg-green-500/20 items-center justify-center mr-3">
                    <Icon name="Check" size={14} color="#22C55E" />
                  </View>
                  <ThemedText>{item}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View className="h-48" />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Payment Section */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <ThemedText className="opacity-50">Total</ThemedText>
          <ThemedText className="font-bold text-2xl">${finalPrice.toFixed(2)}</ThemedText>
        </View>

        {/* Apple Pay button — always shown on iOS */}
        {Platform.OS === 'ios' && (
          <PlatformPayButton
            onPress={handleApplePay}
            type={PlatformPay.ButtonType.Pay}
            appearance={PlatformPay.ButtonStyle.Black}
            borderRadius={25}
            disabled={!isFormValid || isProcessing}
            style={{ width: '100%', height: 52, marginBottom: 10 }}
          />
        )}

        {/* Card payment button — shown on Android, or as fallback on iOS */}
        {Platform.OS !== 'ios' && (
          <Button
            title={isProcessing ? 'Processing...' : `Pay $${finalPrice.toFixed(2)}`}
            onPress={handlePayment}
            disabled={!isFormValid || isProcessing}
            iconStart={isProcessing ? undefined : 'CreditCard'}
            loading={isProcessing}
            size="large"
            variant="cta"
            rounded="full"
          />
        )}

        {/* Secondary card option on iOS */}
        {Platform.OS === 'ios' && (
          <Pressable
            onPress={handlePayment}
            disabled={!isFormValid || isProcessing}
            className="py-2"
          >
            <ThemedText className="text-center text-sm font-medium" style={{ color: colors.highlight }}>
              Or pay with card
            </ThemedText>
          </Pressable>
        )}

        <ThemedText className="text-center text-sm opacity-40 mt-2">
          Secure payment powered by Stripe
        </ThemedText>
      </View>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center">
          <View className="bg-white rounded-3xl p-8 mx-8 items-center" style={{ minWidth: 280 }}>
            {paymentStep === 'initializing' && (
              <>
                <ActivityIndicator size="large" color="#000" />
                <ThemedText className="text-xl font-bold mt-4 text-black">Preparing Payment...</ThemedText>
              </>
            )}
            {paymentStep === 'processing' && (
              <>
                <ActivityIndicator size="large" color="#000" />
                <ThemedText className="text-xl font-bold mt-4 text-black">Processing...</ThemedText>
                <ThemedText className="text-center opacity-60 mt-2 text-black">Please wait</ThemedText>
              </>
            )}
            {paymentStep === 'success' && (
              <>
                <View className="w-16 h-16 rounded-full bg-green-500 items-center justify-center">
                  <Icon name="Check" size={32} color="white" strokeWidth={3} />
                </View>
                <ThemedText className="text-xl font-bold mt-4 text-black">Payment Complete</ThemedText>
                <ThemedText className="text-center opacity-60 mt-2 text-black">
                  Your booking is confirmed
                </ThemedText>
              </>
            )}
            {paymentStep === 'error' && (
              <>
                <View className="w-16 h-16 rounded-full bg-red-500 items-center justify-center">
                  <Icon name="X" size={32} color="white" strokeWidth={3} />
                </View>
                <ThemedText className="text-xl font-bold mt-4 text-black">Payment Failed</ThemedText>
                <ThemedText className="text-center opacity-60 mt-2 text-black">
                  Please try again
                </ThemedText>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Form Input Component
function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  keyboardType,
  required,
  error,
  onBlur,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  required?: boolean;
  error?: string;
  onBlur?: () => void;
}) {
  const colors = useThemeColors();
  const hasError = !!error;

  return (
    <View>
      <ThemedText className="font-medium mb-2">
        {label} {required && <ThemedText style={{ color: colors.highlight }}>*</ThemedText>}
      </ThemedText>
      <View
        className="bg-secondary rounded-xl px-4 py-3 flex-row items-center"
        style={[shadowPresets.small, hasError && { borderWidth: 1, borderColor: '#EF4444' }]}
      >
        <Icon name={icon as any} size={20} color={hasError ? '#EF4444' : colors.placeholder} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType={keyboardType}
          className="flex-1 ml-3 text-base"
          style={{ color: colors.text }}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
        />
        {hasError && <Icon name="AlertCircle" size={18} color="#EF4444" />}
      </View>
      {hasError && (
        <ThemedText className="text-sm mt-1" style={{ color: '#EF4444' }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}
