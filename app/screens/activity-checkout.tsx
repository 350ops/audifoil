import React, { useState } from 'react';
import { View, ScrollView, TextInput, Modal, ActivityIndicator, Image, Alert, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import { applyPromoCode, PROMO_CODES } from '@/data/activities';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function ActivityCheckoutScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const {
    selectedActivity,
    selectedActivitySlot,
    guestCount,
    addActivityBooking,
    demoUser,
  } = useStore();

  // Form state
  const [name, setName] = useState(demoUser?.name || '');
  const [email, setEmail] = useState(demoUser?.email || '');
  const [whatsapp, setWhatsapp] = useState(demoUser?.whatsapp || '');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ discount: number; label: string } | null>(null);

  // Validation state
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'faceid' | 'processing' | 'success'>('faceid');

  if (!selectedActivity || !selectedActivitySlot) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ThemedText>No booking details found</ThemedText>
        <Button title="Start Over" onPress={() => router.replace('/')} className="mt-4" />
      </View>
    );
  }

  const basePrice = selectedActivitySlot.price * guestCount;
  const discountAmount = promoApplied ? basePrice * (promoApplied.discount / basePrice) : 0;
  const finalPrice = promoApplied
    ? basePrice - (basePrice * (promoApplied.discount / basePrice))
    : basePrice;

  // Calculate actual discount
  const actualDiscount = promoApplied ? basePrice - finalPrice : 0;

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'name' | 'email') => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (field === 'name' && !name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
    } else if (field === 'name') {
      setErrors(prev => ({ ...prev, name: undefined }));
    }

    if (field === 'email') {
      if (!email.trim()) {
        setErrors(prev => ({ ...prev, email: 'Email is required' }));
      } else if (!validateEmail(email)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      } else {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }
  };

  const handleApplyPromo = () => {
    const result = applyPromoCode(promoCode, basePrice);
    if (result) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPromoApplied({ discount: result.discount, label: result.label });
    } else if (promoCode.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Code', 'This promo code is not valid. Try CREW25 for a crew discount!');
    }
  };

  const handleApplePay = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTouched({ name: true, email: true });
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowPaymentModal(true);
    setPaymentStep('faceid');

    try {
      // Simulate Face ID
      await new Promise(resolve => setTimeout(resolve, 1500));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPaymentStep('processing');

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create booking
      await addActivityBooking(
        selectedActivity,
        selectedActivitySlot,
        guestCount,
        { name, email, whatsapp }
      );

      setPaymentStep('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Wait for success animation
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShowPaymentModal(false);
      router.replace('/screens/activity-success');
    } catch (error) {
      setShowPaymentModal(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Booking Failed', 'Something went wrong. Please try again.');
    }
  };

  const isFormValid = name.trim().length > 0 && email.trim().length > 0;

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
                    <Icon name="Users" size={16} color={colors.placeholder} />
                    <ThemedText className="ml-2 opacity-60">
                      {guestCount} guest{guestCount !== 1 ? 's' : ''}
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
                  if (touched.name && text.trim()) {
                    setErrors(prev => ({ ...prev, name: undefined }));
                  }
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
                  if (touched.email && validateEmail(text)) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
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

          {/* Price Summary */}
          <View className="mt-6">
            <ThemedText className="font-bold text-lg mb-3">Price Summary</ThemedText>
            <View className="bg-secondary rounded-xl p-4" style={shadowPresets.card}>
              <View className="flex-row justify-between mb-3">
                <ThemedText className="opacity-60">
                  {selectedActivity.title} × {guestCount}
                </ThemedText>
                <ThemedText className="font-medium">${basePrice}</ThemedText>
              </View>
              {promoApplied && (
                <View className="flex-row justify-between mb-3">
                  <ThemedText style={{ color: '#22C55E' }}>{promoApplied.label}</ThemedText>
                  <ThemedText className="font-medium" style={{ color: '#22C55E' }}>
                    -${actualDiscount.toFixed(2)}
                  </ThemedText>
                </View>
              )}
              <View className="flex-row justify-between pt-3 border-t border-border">
                <ThemedText className="font-bold text-lg">Total</ThemedText>
                <ThemedText className="font-bold text-2xl" style={{ color: colors.highlight }}>
                  ${(basePrice - actualDiscount).toFixed(2)}
                </ThemedText>
              </View>
            </View>
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
          <ThemedText className="font-bold text-2xl">${(basePrice - actualDiscount).toFixed(2)}</ThemedText>
        </View>

        {/* Apple Pay Button */}
        <Pressable
          onPress={handleApplePay}
          disabled={!isFormValid}
          className="overflow-hidden rounded-2xl"
          style={[shadowPresets.medium, { opacity: isFormValid ? 1 : 0.5 }]}
        >
          <Image
            source={require('@/assets/img/apple-pay.png')}
            style={{ width: '100%', height: 56 }}
            resizeMode="contain"
          />
        </Pressable>

        <ThemedText className="text-center text-sm opacity-40 mt-3">
          Demo mode - no real payment
        </ThemedText>
      </View>

      {/* Apple Pay Modal */}
      <Modal visible={showPaymentModal} transparent animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center">
          <View
            className="bg-white rounded-3xl p-8 mx-8 items-center"
            style={{ minWidth: 280 }}
          >
            {paymentStep === 'faceid' && (
              <>
                <Icon name="ScanFace" size={64} color="#000" />
                <ThemedText className="text-xl font-bold mt-4 text-black">Confirm with Face ID</ThemedText>
                <ThemedText className="text-center opacity-60 mt-2 text-black">
                  Double-click to pay ${(basePrice - actualDiscount).toFixed(2)}
                </ThemedText>
              </>
            )}
            {paymentStep === 'processing' && (
              <>
                <ActivityIndicator size="large" color="#000" />
                <ThemedText className="text-xl font-bold mt-4 text-black">Processing...</ThemedText>
                <ThemedText className="text-center opacity-60 mt-2 text-black">
                  Please wait
                </ThemedText>
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
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
        style={[
          shadowPresets.small,
          hasError && { borderWidth: 1, borderColor: '#EF4444' }
        ]}
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
