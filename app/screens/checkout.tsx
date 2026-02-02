import React, { useState, useRef } from 'react';
import { View, Pressable, ScrollView, TextInput, Modal, ActivityIndicator } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { useStore } from '@/store/useStore';
import AirlineLogo from '@/components/AirlineLogo';
import { calculatePrice, CREW_PROMO_CODE, SLOT_PRICE } from '@/data';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export default function CheckoutScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { selectedFlight, selectedSlot, addNewBooking, demoUser } = useStore();
  
  // Form state
  const [name, setName] = useState(demoUser?.name || '');
  const [email, setEmail] = useState(demoUser?.email || '');
  const [whatsapp, setWhatsapp] = useState(demoUser?.whatsapp || '');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'faceid' | 'processing' | 'success'>('faceid');

  if (!selectedFlight || !selectedSlot) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ThemedText>No booking details found</ThemedText>
        <Button title="Start Over" onPress={() => router.replace('/arrivals')} className="mt-4" />
      </View>
    );
  }

  const { price, discount, originalPrice } = calculatePrice(promoApplied ? promoCode : undefined);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === CREW_PROMO_CODE) {
      setPromoApplied(true);
    }
  };

  const handleApplePay = async () => {
    if (!name.trim() || !email.trim()) return;
    
    setShowPaymentModal(true);
    setPaymentStep('faceid');
    
    // Simulate Face ID
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPaymentStep('processing');
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create booking
    const booking = await addNewBooking(
      selectedFlight,
      selectedSlot,
      { name, email, whatsapp }
    );
    
    setPaymentStep('success');
    
    // Wait for success animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowPaymentModal(false);
    router.replace('/screens/success');
  };

  const isFormValid = name.trim().length > 0 && email.trim().length > 0;

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title="Checkout" />
      
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Booking Summary Card */}
        <View className="pt-4">
          <AnimatedView animation="scaleIn" duration={300}>
            <View className="bg-secondary rounded-2xl overflow-hidden" style={shadowPresets.card}>
              <View className="p-4 flex-row items-center">
                <AirlineLogo airlineCode={selectedFlight.airlineCode} size={48} style={{ marginRight: 16 }} />
                <View className="flex-1">
                  <ThemedText className="font-bold text-lg">{selectedFlight.flightNo}</ThemedText>
                  <ThemedText className="opacity-50">{selectedFlight.originCity} → Malé</ThemedText>
                </View>
                <View className="items-end">
                  <ThemedText className="font-bold text-xl" style={{ color: colors.highlight }}>
                    {selectedSlot.startLocal}
                  </ThemedText>
                  <ThemedText className="opacity-50 text-sm">Session</ThemedText>
                </View>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* Contact Details Form */}
        <View className="mt-6">
          <ThemedText className="text-xl font-bold mb-4">Contact Details</ThemedText>
          
          <View className="gap-4">
            <FormInput
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              icon="User"
              required
            />
            <FormInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              icon="Mail"
              keyboardType="email-address"
              required
            />
            <FormInput
              label="WhatsApp (for confirmation)"
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
            <View className="flex-1 bg-secondary rounded-xl px-4 py-3 flex-row items-center" style={shadowPresets.small}>
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
              Crew discount applied! You save ${discount.toFixed(2)}
            </ThemedText>
          )}
        </View>

        {/* Price Summary */}
        <View className="mt-6">
          <ThemedText className="font-bold text-lg mb-3">Price Summary</ThemedText>
          <View className="bg-secondary rounded-xl p-4" style={shadowPresets.card}>
            <View className="flex-row justify-between mb-3">
              <ThemedText className="opacity-60">E-Foil Session (45 min)</ThemedText>
              <ThemedText className="font-medium">${SLOT_PRICE}</ThemedText>
            </View>
            {promoApplied && (
              <View className="flex-row justify-between mb-3">
                <ThemedText style={{ color: '#22C55E' }}>Crew Discount (25%)</ThemedText>
                <ThemedText className="font-medium" style={{ color: '#22C55E' }}>
                  -${discount.toFixed(2)}
                </ThemedText>
              </View>
            )}
            <View className="flex-row justify-between pt-3 border-t border-border">
              <ThemedText className="font-bold text-lg">Total</ThemedText>
              <ThemedText className="font-bold text-2xl" style={{ color: colors.highlight }}>
                ${price.toFixed(2)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* What's Included */}
        <View className="mt-6 mb-8">
          <ThemedText className="font-bold text-lg mb-3">What's Included</ThemedText>
          <View className="bg-secondary rounded-xl p-4" style={shadowPresets.card}>
            <IncludedItem icon="Check" text="45-minute e-foil session" />
            <IncludedItem icon="Check" text="Professional instructor" />
            <IncludedItem icon="Check" text="Safety equipment & wetsuit" />
            <IncludedItem icon="Check" text="GoPro footage included" />
            <IncludedItem icon="Check" text="Refreshments" isLast />
          </View>
        </View>

        <View className="h-48" />
      </ScrollView>

      {/* Bottom Payment Section */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <ThemedText className="opacity-50">Total</ThemedText>
          <ThemedText className="font-bold text-2xl">${price.toFixed(2)}</ThemedText>
        </View>
        
        {/* Apple Pay Button */}
        <Pressable
          onPress={handleApplePay}
          disabled={!isFormValid}
          className="rounded-xl overflow-hidden"
          style={[shadowPresets.medium, { opacity: isFormValid ? 1 : 0.5 }]}
        >
          <View className="py-4 flex-row items-center justify-center bg-black">
            <Icon name="Apple" size={22} color="white" />
            <ThemedText className="text-white font-semibold ml-2 text-lg">Pay</ThemedText>
          </View>
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
                  Double-click to pay ${price.toFixed(2)}
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

function FormInput({ label, placeholder, value, onChangeText, icon, keyboardType, required }: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  required?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View>
      <ThemedText className="font-medium mb-2">
        {label} {required && <ThemedText style={{ color: colors.highlight }}>*</ThemedText>}
      </ThemedText>
      <View 
        className="bg-secondary rounded-xl px-4 py-3 flex-row items-center"
        style={shadowPresets.small}
      >
        <Icon name={icon as any} size={20} color={colors.placeholder} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType={keyboardType}
          className="flex-1 ml-3 text-base"
          style={{ color: colors.text }}
        />
      </View>
    </View>
  );
}

function IncludedItem({ icon, text, isLast }: { icon: string; text: string; isLast?: boolean }) {
  return (
    <View className={`flex-row items-center ${!isLast ? 'mb-3' : ''}`}>
      <View className="w-6 h-6 rounded-full bg-green-500/20 items-center justify-center mr-3">
        <Icon name={icon as any} size={14} color="#22C55E" />
      </View>
      <ThemedText>{text}</ThemedText>
    </View>
  );
}
