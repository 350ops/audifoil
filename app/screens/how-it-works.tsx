import React from 'react';
import { View, Dimensions } from 'react-native';
import Header from '@/components/Header';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    icon: 'Plane',
    title: 'Select Your Flight',
    description: 'Browse today\'s arrivals at Malé International Airport (MLE) and select your incoming flight.',
  },
  {
    icon: 'Clock',
    title: 'Choose a Time Slot',
    description: 'Sessions start 1 hour after your arrival. Pick from available 45-minute slots throughout the day.',
  },
  {
    icon: 'Users',
    title: 'See Who\'s Joining',
    description: 'View crew badges showing which airlines have already booked each slot. Perfect for connecting with colleagues.',
  },
  {
    icon: 'CreditCard',
    title: 'Quick Checkout',
    description: 'Complete your booking with Apple Pay in seconds. No registration required.',
  },
  {
    icon: 'MapPin',
    title: 'Meet at the Dock',
    description: 'Head to Malé Lagoon Dock after landing. Look for our team with blue foilTribe Adventures flags.',
  },
  {
    icon: 'Waves',
    title: 'Fly Over Paradise',
    description: 'Experience the thrill of gliding above crystal-clear waters on a premium Audi e-foil.',
  },
];

const FEATURES = [
  {
    icon: 'Shield',
    title: 'Safety First',
    description: 'Professional instructors and all safety equipment provided',
  },
  {
    icon: 'Camera',
    title: 'GoPro Included',
    description: 'Capture your experience with complimentary footage',
  },
  {
    icon: 'RefreshCw',
    title: 'Free Cancellation',
    description: 'Cancel up to 2 hours before for a full refund',
  },
  {
    icon: 'Award',
    title: 'Premium Equipment',
    description: 'Audi-engineered e-foils for the best experience',
  },
];

export default function HowItWorksScreen() {
  const colors = useThemeColors();

  return (
    <>
      <Header
        showBackButton
        title="How It Works"
      />
      <ThemedScroller className="!px-4">
        {/* Hero Section */}
        <View className="pt-4 pb-6">
          <AnimatedView animation="fadeIn" duration={400}>
            <ThemedText className="text-3xl font-bold mb-2">
              Experience the Future of Water Sports
            </ThemedText>
            <ThemedText className="opacity-60 text-lg">
              Book your e-foil session in just a few taps
            </ThemedText>
          </AnimatedView>
        </View>

        {/* Steps */}
        <View className="mb-8">
          <ThemedText className="text-xl font-bold mb-4">The Process</ThemedText>
          <View className="gap-4">
            {STEPS.map((step, index) => (
              <AnimatedView
                key={index}
                animation="scaleIn"
                duration={300}
                delay={index * 80}
              >
                <StepCard
                  number={index + 1}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  isLast={index === STEPS.length - 1}
                />
              </AnimatedView>
            ))}
          </View>
        </View>

        {/* Features */}
        <View className="mb-8">
          <ThemedText className="text-xl font-bold mb-4">What's Included</ThemedText>
          <View className="flex-row flex-wrap gap-3">
            {FEATURES.map((feature, index) => (
              <AnimatedView
                key={index}
                animation="fadeIn"
                duration={300}
                delay={400 + index * 50}
                className="w-[48%]"
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </AnimatedView>
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View className="mb-8">
          <ThemedText className="text-xl font-bold mb-4">Pricing</ThemedText>
          <AnimatedView animation="scaleIn" duration={300} delay={500}>
            <View 
              className="bg-secondary rounded-2xl overflow-hidden"
              style={shadowPresets.card}
            >
              <LinearGradient
                colors={[colors.highlight, colors.oceanLight || '#00A6F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-5"
              >
                <View className="flex-row items-baseline">
                  <ThemedText className="text-white text-4xl font-bold">$249</ThemedText>
                  <ThemedText className="text-white/70 text-lg ml-2">per session</ThemedText>
                </View>
                <ThemedText className="text-white/80 mt-2">
                  45-minute experience with instruction
                </ThemedText>
              </LinearGradient>
              <View className="p-4">
                <View className="flex-row items-center mb-2">
                  <Icon name="Check" size={18} color="#22C55E" className="mr-2" />
                  <ThemedText>Professional instruction included</ThemedText>
                </View>
                <View className="flex-row items-center mb-2">
                  <Icon name="Check" size={18} color="#22C55E" className="mr-2" />
                  <ThemedText>All equipment provided</ThemedText>
                </View>
                <View className="flex-row items-center mb-2">
                  <Icon name="Check" size={18} color="#22C55E" className="mr-2" />
                  <ThemedText>GoPro footage included</ThemedText>
                </View>
                <View className="flex-row items-center">
                  <Icon name="Check" size={18} color="#22C55E" className="mr-2" />
                  <ThemedText>Refreshments provided</ThemedText>
                </View>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* CTA */}
        <AnimatedView animation="scaleIn" duration={300} delay={600}>
          <Button
            title="Browse Available Sessions"
            onPress={() => router.push('/arrivals')}
            iconEnd="ArrowRight"
            className="mb-4"
          />
        </AnimatedView>

        <View className="h-20" />
      </ThemedScroller>
    </>
  );
}

function StepCard({ number, icon, title, description, isLast }: {
  number: number;
  icon: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  const colors = useThemeColors();
  
  return (
    <View className="flex-row">
      {/* Number line */}
      <View className="items-center mr-4">
        <View 
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.highlight }}
        >
          <ThemedText className="text-white font-bold">{number}</ThemedText>
        </View>
        {!isLast && (
          <View 
            className="w-0.5 flex-1 mt-2"
            style={{ backgroundColor: colors.border }}
          />
        )}
      </View>
      
      {/* Content */}
      <View 
        className="flex-1 bg-secondary rounded-xl p-4 mb-2"
        style={shadowPresets.card}
      >
        <View className="flex-row items-center mb-2">
          <Icon name={icon as any} size={20} color={colors.highlight} className="mr-2" />
          <ThemedText className="font-bold text-lg">{title}</ThemedText>
        </View>
        <ThemedText className="opacity-60">{description}</ThemedText>
      </View>
    </View>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) {
  const colors = useThemeColors();
  
  return (
    <View 
      className="bg-secondary rounded-xl p-4"
      style={shadowPresets.card}
    >
      <View 
        className="w-10 h-10 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: `${colors.highlight}15` }}
      >
        <Icon name={icon as any} size={20} color={colors.highlight} />
      </View>
      <ThemedText className="font-semibold mb-1">{title}</ThemedText>
      <ThemedText className="text-sm opacity-50">{description}</ThemedText>
    </View>
  );
}
