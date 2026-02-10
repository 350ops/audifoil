import React, { useState, useMemo } from 'react';
import { View, Pressable, Modal, FlatList } from 'react-native';
import ThemedText from '@/components/ThemedText';
import Icon from '@/components/Icon';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/contexts/ThemeColors';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Generate time slots from 08:00 to 16:00 (every 30 min)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 16; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 16) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// Generate dates for next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dates.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${dayName}, ${dateStr}`,
      shortLabel: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : `${dayName} ${date.getDate()}`,
      value: date.toISOString().split('T')[0],
      date: date,
    });
  }
  return dates;
};

const DATES = generateDates();

const SEAT_PRICE = 1; // TESTING: set to $1, change back to $80 for production

interface CrewQuickBookCardProps {
  onBook?: (params: {
    date: string;
    startTime: string;
    duration: number;
    seats: number;
    totalPrice: number;
  }) => void;
}

export default function CrewQuickBookCard({ onBook }: CrewQuickBookCardProps) {
  const colors = useThemeColors();
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<3 | 5>(5);
  const [seats, setSeats] = useState(1);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const totalPrice = SEAT_PRICE * seats;
  const isValid = selectedTime !== null;

  const endTime = useMemo(() => {
    if (!selectedTime) return null;
    const [hours, mins] = selectedTime.split(':').map(Number);
    const endHour = hours + duration;
    return `${endHour.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, [selectedTime, duration]);

  const itinerary = useMemo(() => {
    if (duration === 5) {
      return 'Lagoon cruise → snorkel stop → fishing option → sandbank photo stop';
    }
    return 'Lagoon cruise → snorkel stop → quick sandbank pass';
  }, [duration]);

  const handleBook = () => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const bookingParams = {
      date: selectedDate.value,
      dateLabel: selectedDate.label,
      startTime: selectedTime!,
      endTime: endTime!,
      duration,
      seats,
      totalPrice,
      seatPrice: SEAT_PRICE,
      itinerary,
    };

    if (onBook) {
      onBook(bookingParams);
    } else {
      router.push({
        pathname: '/screens/crew-booking-summary',
        params: bookingParams,
      });
    }
  };

  const getConfirmationMessage = () => {
    if (seats < 4) {
      return "You're joining a shared trip — we'll match you with other crew.";
    }
    return "This will likely confirm immediately.";
  };

  return (
    <View
      className="rounded-2xl overflow-hidden"
      style={[shadowPresets.large, { backgroundColor: '#FFFFFF' }]}
    >
      {/* Price Header — Airbnb style */}
      <View className="p-4 pb-3">
        <View className="flex-row items-baseline">
          <ThemedText className="text-2xl font-bold" style={{ color: '#000000' }}>
            From ${SEAT_PRICE}
          </ThemedText>
          <ThemedText className="text-base ml-1" style={{ color: colors.textMuted }}> / seat</ThemedText>
        </View>
        <ThemedText className="text-sm mt-1" style={{ color: colors.textMuted }}>
          Shared trips (4–5 guests). Pay per seat, not per boat.
        </ThemedText>
        
        <Pressable
          onPress={() => setShowPriceDetails(!showPriceDetails)}
          className="flex-row items-center mt-2"
        >
          <ThemedText className="text-sm underline" style={{ color: colors.cta }}>
            Price details
          </ThemedText>
          <Icon name={showPriceDetails ? 'ChevronUp' : 'ChevronDown'} size={14} color={colors.cta} />
        </Pressable>
        
        {showPriceDetails && (
          <View className="rounded-xl p-3 mt-2" style={{ backgroundColor: colors.bg }}>
            <ThemedText className="text-sm" style={{ color: colors.textMuted }}>
              Boat total is split across the group (min 4 seats to confirm). The more seats filled, the lower your cost.
            </ThemedText>
          </View>
        )}
      </View>

      {/* Selectors Grid */}
      <View style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        {/* Date & Seats Row */}
        <View className="flex-row" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Pressable onPress={() => setShowDatePicker(true)} className="flex-1 p-4" style={{ borderRightWidth: 1, borderRightColor: colors.border }}>
            <ThemedText className="text-xs mb-1" style={{ color: colors.textMuted }}>Date</ThemedText>
            <View className="flex-row items-center justify-between">
              <ThemedText className="font-semibold" style={{ color: '#000000' }}>{selectedDate.shortLabel}</ThemedText>
              <Icon name="ChevronDown" size={16} color={colors.textMuted} />
            </View>
          </Pressable>
          <View className="flex-1 p-4">
            <ThemedText className="text-xs mb-1" style={{ color: colors.textMuted }}>Seats</ThemedText>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Icon name="Users" size={16} color="#000000" />
                <ThemedText className="font-semibold ml-2" style={{ color: '#000000' }}>{seats}</ThemedText>
              </View>
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => { if (seats > 1) { Haptics.selectionAsync(); setSeats(seats - 1); } }}
                  className="w-7 h-7 rounded-full items-center justify-center"
                  style={{ backgroundColor: seats > 1 ? colors.cta + '20' : colors.border }}
                >
                  <Icon name="Minus" size={14} color={seats > 1 ? colors.cta : colors.textMuted} />
                </Pressable>
                <Pressable
                  onPress={() => { if (seats < 5) { Haptics.selectionAsync(); setSeats(seats + 1); } }}
                  className="w-7 h-7 rounded-full items-center justify-center"
                  style={{ backgroundColor: seats < 5 ? colors.cta + '20' : colors.border }}
                >
                  <Icon name="Plus" size={14} color={seats < 5 ? colors.cta : colors.textMuted} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Time & Duration Row */}
        <View className="flex-row">
          <Pressable onPress={() => setShowTimePicker(true)} className="flex-1 p-4" style={{ borderRightWidth: 1, borderRightColor: colors.border }}>
            <ThemedText className="text-xs mb-1" style={{ color: colors.textMuted }}>Start time</ThemedText>
            <View className="flex-row items-center justify-between">
              <ThemedText className="font-semibold" style={{ color: selectedTime ? '#000000' : colors.textMuted }}>
                {selectedTime || 'Select'}
              </ThemedText>
              <Icon name="ChevronDown" size={16} color={colors.textMuted} />
            </View>
          </Pressable>
          <View className="flex-1 p-4">
            <ThemedText className="text-xs mb-1" style={{ color: colors.textMuted }}>Duration</ThemedText>
            <View className="flex-row rounded-lg p-1" style={{ backgroundColor: colors.bg }}>
              <Pressable
                onPress={() => { Haptics.selectionAsync(); setDuration(3); }}
                className="flex-1 py-1.5 rounded-md items-center"
                style={{ backgroundColor: duration === 3 ? colors.cta : 'transparent' }}
              >
                <ThemedText className="text-sm font-medium" style={{ color: duration === 3 ? 'white' : colors.text }}>3h</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => { Haptics.selectionAsync(); setDuration(5); }}
                className="flex-1 py-1.5 rounded-md items-center"
                style={{ backgroundColor: duration === 5 ? colors.cta : 'transparent' }}
              >
                <ThemedText className="text-sm font-medium" style={{ color: duration === 5 ? 'white' : colors.text }}>5h</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* CTA Section — Airbnb Reserve style */}
      <View className="p-4 pt-3">
        {selectedTime && (
          <View className="flex-row items-center justify-between mb-3">
            <ThemedText className="text-base" style={{ color: colors.textMuted }}>
              {seats} seat{seats > 1 ? 's' : ''} × ${SEAT_PRICE}
            </ThemedText>
            <ThemedText className="font-bold text-lg" style={{ color: '#000000' }}>${totalPrice}</ThemedText>
          </View>
        )}

        <Pressable
          onPress={handleBook}
          disabled={!isValid}
          className="py-4 rounded-full flex-row items-center justify-center"
          style={{ backgroundColor: colors.cta, opacity: isValid ? 1 : 0.5 }}
        >
          <ThemedText className="text-white font-semibold text-base mr-2">See Plan & Price</ThemedText>
          <Icon name="ArrowRight" size={18} color="white" />
        </Pressable>

        <View className="mt-3 px-1">
          <ThemedText className="text-xs" style={{ color: colors.textMuted }}>{getConfirmationMessage()}</ThemedText>
        </View>
        <View className="mt-1 px-1">
          <ThemedText className="text-xs" style={{ color: colors.textMuted }}>Trip confirms when 4 seats are filled</ThemedText>
        </View>
      </View>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowTimePicker(false)}
        >
          <Pressable onPress={e => e.stopPropagation()}>
            <View className="bg-secondary rounded-t-3xl" style={{ maxHeight: '60%' }}>
              <View className="p-4 border-b border-border flex-row items-center justify-between">
                <ThemedText className="text-lg font-bold">Select Start Time</ThemedText>
                <Pressable onPress={() => setShowTimePicker(false)}>
                  <Icon name="X" size={24} color={colors.text} />
                </Pressable>
              </View>
              <FlatList
                data={TIME_SLOTS}
                keyExtractor={(item) => item}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedTime(item);
                      setShowTimePicker(false);
                    }}
                    className="py-4 px-4 rounded-xl mb-2 flex-row items-center justify-between"
                    style={{ 
                      backgroundColor: selectedTime === item ? colors.highlight : colors.background 
                    }}
                  >
                    <ThemedText 
                      className="font-medium text-lg"
                      style={{ color: selectedTime === item ? 'white' : colors.text }}
                    >
                      {item}
                    </ThemedText>
                    {selectedTime === item && (
                      <Icon name="Check" size={20} color="white" />
                    )}
                  </Pressable>
                )}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowDatePicker(false)}
        >
          <Pressable onPress={e => e.stopPropagation()}>
            <View className="bg-secondary rounded-t-3xl">
              <View className="p-4 border-b border-border flex-row items-center justify-between">
                <ThemedText className="text-lg font-bold">Select Date</ThemedText>
                <Pressable onPress={() => setShowDatePicker(false)}>
                  <Icon name="X" size={24} color={colors.text} />
                </Pressable>
              </View>
              <View className="p-4">
                {DATES.map((date) => (
                  <Pressable
                    key={date.value}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                    className="py-4 px-4 rounded-xl mb-2 flex-row items-center justify-between"
                    style={{ 
                      backgroundColor: selectedDate.value === date.value ? colors.highlight : colors.background 
                    }}
                  >
                    <ThemedText 
                      className="font-medium"
                      style={{ color: selectedDate.value === date.value ? 'white' : colors.text }}
                    >
                      {date.label}
                    </ThemedText>
                    {selectedDate.value === date.value && (
                      <Icon name="Check" size={20} color="white" />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
