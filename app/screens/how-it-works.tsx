import React from 'react';
import { View, Pressable, Linking } from 'react-native';
import Header from '@/components/Header';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { LinearGradient } from 'expo-linear-gradient';

const WHATSAPP_NUMBER = '960XXXXXXX'; // Replace with actual number

const STEPS = [
  {
    icon: 'Calendar',
    title: 'Pick a Date',
    description:
      'Check our calendar for upcoming trips. We run adventures most days — morning and afternoon departures.',
  },
  {
    icon: 'MessageCircle',
    title: 'Reserve via WhatsApp',
    description:
      'Tap "Join Trip" and lock in your spot with a quick WhatsApp message. No payment until the trip is confirmed.',
  },
  {
    icon: 'Share2',
    title: 'Spread the Word',
    description:
      'Share your trip link with friends or colleagues. The more people who join, the less everyone pays. From $80/person with 5 guests.',
  },
  {
    icon: 'MapPin',
    title: 'Show Up & Enjoy',
    description:
      'We pick you up from Malé or Hulhumalé. All you need is sunscreen and a swimsuit — we handle everything else.',
  },
];

const INCLUDED = [
  { icon: 'Fish', title: 'Dolphins & Snorkeling', description: 'Swim with wild spinner dolphins and explore two pristine reefs' },
  { icon: 'Sun', title: 'Private Sandbank', description: 'Your own strip of white sand with picnic lunch and drinks' },
  { icon: 'Zap', title: 'Audi E-Foil Session', description: 'Every guest flies the e-foil — worth $150+ at resorts' },
  { icon: 'Camera', title: 'Drone & 360 Footage', description: 'Professional drone aerial and 360-cam footage — all yours to keep' },
  { icon: 'Truck', title: 'Hotel Pickup', description: 'Free pickup and drop-off from Malé or Hulhumalé' },
  { icon: 'Coffee', title: 'Food & Drinks', description: 'Picnic lunch, snacks, and refreshments throughout the day' },
];

export default function HowItWorksScreen() {
  const colors = useThemeColors();

  const openWhatsApp = () => {
    Linking.openURL(
      `https://wa.me/${WHATSAPP_NUMBER}?text=Hey! I'd like to join a foiltribe Maldives Adventure.`
    );
  };

  return (
    <>
      <Header showBackButton title="How It Works" />
      <ThemedScroller className="!px-4">
        {/* Hero Section */}
        <View className="pb-6 pt-4">
          <AnimatedView animation="fadeIn" duration={400}>
            <ThemedText className="mb-2 text-3xl font-bold">
              Your Best Day in the Maldives
            </ThemedText>
            <ThemedText className="text-lg opacity-60">
              Four steps. Zero hassle. One incredible day on the water.
            </ThemedText>
          </AnimatedView>
        </View>

        {/* Steps */}
        <View className="mb-8">
          <ThemedText className="mb-4 text-xl font-bold">The Process</ThemedText>
          <View className="gap-4">
            {STEPS.map((step, index) => (
              <AnimatedView key={index} animation="scaleIn" duration={300} delay={index * 80}>
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

        {/* What's Included */}
        <View className="mb-8">
          <ThemedText className="mb-4 text-xl font-bold">What's Included</ThemedText>
          <View className="flex-row flex-wrap gap-3">
            {INCLUDED.map((feature, index) => (
              <AnimatedView
                key={index}
                animation="fadeIn"
                duration={300}
                delay={400 + index * 50}
                className="w-[48%]"
              >
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
              </AnimatedView>
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View className="mb-8">
          <ThemedText className="mb-4 text-xl font-bold">Pricing</ThemedText>
          <AnimatedView animation="scaleIn" duration={300} delay={500}>
            <View className="overflow-hidden rounded-2xl bg-secondary" style={shadowPresets.card}>
              <LinearGradient
                colors={[colors.highlight, '#0284C7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ padding: 20 }}
              >
                <View className="flex-row items-baseline">
                  <ThemedText className="text-4xl font-bold text-white">From $80</ThemedText>
                  <ThemedText className="ml-2 text-lg text-white/70">/ person</ThemedText>
                </View>
                <ThemedText className="mt-2 text-white/80">
                  5-hour adventure with 5 guests. Price adjusts with group size.
                </ThemedText>
              </LinearGradient>
              <View className="p-4">
                {[
                  '5-hour boat adventure with all activities',
                  'Dolphin swim + 2 reef snorkel stops',
                  'Private sandbank + picnic lunch',
                  'E-foil session for every guest',
                  'Drone & 360-camera footage included',
                  'Hotel pickup & drop-off',
                  'No hidden fees. No surprises.',
                ].map((item, i) => (
                  <View key={i} className="mb-2 flex-row items-center">
                    <Icon name="Check" size={18} color="#22C55E" />
                    <ThemedText className="ml-2">{item}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* WhatsApp CTA */}
        <AnimatedView animation="scaleIn" duration={300} delay={600}>
          <Pressable
            onPress={openWhatsApp}
            className="mb-4 flex-row items-center justify-center rounded-full py-4"
            style={{ backgroundColor: '#25D366' }}
          >
            <Icon name="MessageCircle" size={20} color="white" />
            <ThemedText className="ml-2 font-semibold text-white">Book via WhatsApp</ThemedText>
          </Pressable>
        </AnimatedView>

        <View className="h-20" />
      </ThemedScroller>
    </>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
  isLast,
}: {
  number: number;
  icon: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  const colors = useThemeColors();

  return (
    <View className="flex-row">
      <View className="mr-4 items-center">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.highlight }}
        >
          <ThemedText className="font-bold text-white">{number}</ThemedText>
        </View>
        {!isLast && <View className="mt-2 w-0.5 flex-1" style={{ backgroundColor: colors.border }} />}
      </View>

      <View className="mb-2 flex-1 rounded-xl bg-secondary p-4" style={shadowPresets.card}>
        <View className="mb-2 flex-row items-center">
          <Icon name={icon as any} size={20} color={colors.highlight} />
          <ThemedText className="ml-2 text-lg font-bold">{title}</ThemedText>
        </View>
        <ThemedText className="opacity-60">{description}</ThemedText>
      </View>
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const colors = useThemeColors();

  return (
    <View className="rounded-xl bg-secondary p-4" style={shadowPresets.card}>
      <View
        className="mb-3 h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${colors.highlight}15` }}
      >
        <Icon name={icon as any} size={20} color={colors.highlight} />
      </View>
      <ThemedText className="mb-1 font-semibold">{title}</ThemedText>
      <ThemedText className="text-sm opacity-50">{description}</ThemedText>
    </View>
  );
}
