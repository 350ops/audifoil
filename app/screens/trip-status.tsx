import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Share, Pressable, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

interface PaymentRecord {
  id: string;
  guestName: string | null;
  guestEmail: string | null;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  isBooker: boolean;
  paidAt: string | null;
}

interface TripStatusData {
  booking: {
    id: string;
    confirmationCode: string;
    activityId: string;
    slotDate: string;
    slotTime: string;
    totalGuests: number;
    pricePerPerson: number;
    bookerName: string;
    paymentLinkUrl: string | null;
    createdAt: string;
  };
  payments: PaymentRecord[];
  summary: {
    totalGuests: number;
    paidCount: number;
    pendingCount: number;
    failedCount: number;
  };
}

// ──────────────────────────────────────────────
// Progress Ring Component
// ──────────────────────────────────────────────

function ProgressRing({
  paid,
  total,
  size = 120,
  strokeWidth = 10,
}: {
  paid: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}) {
  const colors = useThemeColors();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? paid / total : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progress === 1 ? '#22C55E' : colors.highlight}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <ThemedText style={{ fontSize: 28, fontWeight: '700' }}>
          {paid}/{total}
        </ThemedText>
        <ThemedText className="text-xs opacity-50">paid</ThemedText>
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

export default function TripStatusScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  const [data, setData] = useState<TripStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!bookingId || !SUPABASE_URL || !SUPABASE_KEY) return;

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/trip-status?booking_id=${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
            apikey: SUPABASE_KEY,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch trip status:', error);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
  }, [fetchStatus]);

  const handleShareLink = async () => {
    if (!data?.booking.paymentLinkUrl) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    await Share.share({
      message: `Join our foiltribe Maldives Adventure!\n\n${data.booking.slotDate} · ${data.booking.slotTime}\nPay your share ($${data.booking.pricePerPerson}) here:\n${data.booking.paymentLinkUrl}`,
    });
  };

  const handleCopyLink = async () => {
    if (!data?.booking.paymentLinkUrl) return;
    await Clipboard.setStringAsync(data.booking.paymentLinkUrl);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Payment link copied to clipboard');
  };

  if (loading) {
    return (
      <>
        <Header showBackButton title="Trip Status" />
        <View className="flex-1 items-center justify-center bg-background">
          <ThemedText className="opacity-50">Loading...</ThemedText>
        </View>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header showBackButton title="Trip Status" />
        <View className="flex-1 items-center justify-center bg-background px-4">
          <Icon name="AlertCircle" size={48} color={colors.placeholder} />
          <ThemedText className="mt-4 text-xl font-bold">Could not load status</ThemedText>
          <ThemedText className="mt-2 text-center opacity-50">
            Pull down to refresh or check your connection.
          </ThemedText>
        </View>
      </>
    );
  }

  const { booking, payments, summary } = data;
  const allPaid = summary.paidCount === summary.totalGuests;

  return (
    <>
      <Header showBackButton title="Trip Status" />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />
        }
      >
        {/* Trip Info + Progress Ring */}
        <View className="items-center px-4 pt-6">
          <AnimatedView animation="scaleIn" delay={100}>
            <ProgressRing paid={summary.paidCount} total={summary.totalGuests} />
          </AnimatedView>

          <ThemedText className="mt-4 text-lg font-bold">
            {allPaid ? 'All Paid!' : `${summary.pendingCount} ${summary.pendingCount === 1 ? 'payment' : 'payments'} pending`}
          </ThemedText>

          <ThemedText className="mt-1 text-sm opacity-50">
            {booking.confirmationCode} · {booking.slotDate} · {booking.slotTime}
          </ThemedText>
        </View>

        {/* Guest Payment List */}
        <View className="mt-6 px-4">
          <ThemedText className="mb-3 text-lg font-bold">Payments</ThemedText>

          <View className="overflow-hidden rounded-2xl bg-secondary" style={shadowPresets.card}>
            {payments.map((payment, i) => (
              <View
                key={payment.id}
                className={`flex-row items-center p-4 ${i < payments.length - 1 ? 'border-b border-border' : ''}`}
              >
                {/* Status icon */}
                <View
                  className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      payment.status === 'paid'
                        ? '#22C55E20'
                        : payment.status === 'failed'
                          ? '#EF444420'
                          : colors.highlight + '15',
                  }}
                >
                  <Icon
                    name={
                      payment.status === 'paid'
                        ? 'Check'
                        : payment.status === 'failed'
                          ? 'X'
                          : 'Clock'
                    }
                    size={20}
                    color={
                      payment.status === 'paid'
                        ? '#22C55E'
                        : payment.status === 'failed'
                          ? '#EF4444'
                          : colors.highlight
                    }
                  />
                </View>

                {/* Guest info */}
                <View className="flex-1">
                  <ThemedText className="font-medium">
                    {payment.isBooker
                      ? `${payment.guestName || 'You'} (organizer)`
                      : payment.guestName || `Guest ${i + 1}`}
                  </ThemedText>
                  <ThemedText className="text-xs opacity-40">
                    {payment.status === 'paid'
                      ? `Paid · $${payment.amount}`
                      : payment.status === 'failed'
                        ? 'Payment failed'
                        : `Pending · $${payment.amount}`}
                  </ThemedText>
                </View>

                {/* Status badge */}
                <View
                  className="rounded-full px-3 py-1"
                  style={{
                    backgroundColor:
                      payment.status === 'paid'
                        ? '#22C55E15'
                        : payment.status === 'failed'
                          ? '#EF444415'
                          : colors.highlight + '15',
                  }}
                >
                  <ThemedText
                    className="text-xs font-semibold"
                    style={{
                      color:
                        payment.status === 'paid'
                          ? '#22C55E'
                          : payment.status === 'failed'
                            ? '#EF4444'
                            : colors.highlight,
                    }}
                  >
                    {payment.status === 'paid' ? 'Paid' : payment.status === 'failed' ? 'Failed' : 'Pending'}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Share Link (if there are pending payments) */}
        {!allPaid && booking.paymentLinkUrl && (
          <View className="mt-6 px-4">
            <ThemedText className="mb-3 text-lg font-bold">Payment Link</ThemedText>
            <View className="rounded-2xl bg-secondary p-4" style={shadowPresets.card}>
              <ThemedText className="mb-3 text-sm opacity-60">
                Share this link with your crew so they can pay their share.
              </ThemedText>

              <View
                className="flex-row items-center rounded-xl bg-background p-3"
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                <Icon name="Link" size={16} color={colors.highlight} />
                <ThemedText className="ml-2 flex-1 text-sm" numberOfLines={1}>
                  {booking.paymentLinkUrl}
                </ThemedText>
                <Pressable onPress={handleCopyLink} className="ml-2 p-1">
                  <Icon name="Copy" size={18} color={colors.highlight} />
                </Pressable>
              </View>

              <View className="mt-3 flex-row gap-3">
                <View className="flex-1">
                  <Button
                    title="Share Link"
                    iconStart="Share"
                    onPress={handleShareLink}
                    variant="cta"
                    rounded="full"
                  />
                </View>
                <View className="flex-1">
                  <Button
                    title="Copy"
                    iconStart="Copy"
                    onPress={handleCopyLink}
                    variant="outline"
                    rounded="full"
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* All paid celebration */}
        {allPaid && (
          <View className="mt-6 px-4">
            <View
              className="items-center rounded-2xl p-6"
              style={{ backgroundColor: '#22C55E15' }}
            >
              <Icon name="PartyPopper" size={32} color="#22C55E" />
              <ThemedText className="mt-2 text-lg font-bold" style={{ color: '#22C55E' }}>
                Everyone has paid!
              </ThemedText>
              <ThemedText className="mt-1 text-center text-sm opacity-50">
                Your trip is fully confirmed. See you on the water!
              </ThemedText>
            </View>
          </View>
        )}

        {/* Pull to refresh hint */}
        {!allPaid && (
          <ThemedText className="mt-6 text-center text-xs opacity-30">
            Pull down to refresh payment status
          </ThemedText>
        )}
      </ScrollView>
    </>
  );
}
