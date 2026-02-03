import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FlightDateCalendar } from '@/components/FlightDateCalendar';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import Select from '@/components/forms/Select';
import useThemeColors from '@/contexts/ThemeColors';
import {
  type CrewLayover,
  getAirlinesFromFlights,
  getArrivalsForAirline,
  getDeparturesForAirline,
  getSelectableDates,
} from '@/data/flightsMle';
import { useStore } from '@/store/useStore';

export default function CrewScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const setSelectedCrewLayover = useStore((s) => s.setSelectedCrewLayover);

  const [airlineCode, setAirlineCode] = useState<string | number | undefined>(undefined);
  const [arrivalDateStr, setArrivalDateStr] = useState<string | undefined>(undefined);
  const [arrivalFlightNumber, setArrivalFlightNumber] = useState<string | number | undefined>(
    undefined
  );
  const [departureDateStr, setDepartureDateStr] = useState<string | undefined>(undefined);
  const [departureFlightNumber, setDepartureFlightNumber] = useState<string | number | undefined>(
    undefined
  );

  const airlineOptions = useMemo(() => getAirlinesFromFlights(), []);
  const availableDates = useMemo(() => getSelectableDates(90), []);

  const arrivalOptions = useMemo(() => {
    if (typeof airlineCode !== 'string') return [];
    return getArrivalsForAirline(airlineCode).map(({ value, label }) => ({ value, label }));
  }, [airlineCode]);

  const departureOptions = useMemo(() => {
    if (typeof airlineCode !== 'string') return [];
    return getDeparturesForAirline(airlineCode).map(({ value, label }) => ({ value, label }));
  }, [airlineCode]);

  const arrivalFlight = useMemo(() => {
    if (typeof airlineCode !== 'string' || typeof arrivalFlightNumber !== 'string') return null;
    return (
      getArrivalsForAirline(airlineCode).find((f) => f.value === arrivalFlightNumber)?.flight ??
      null
    );
  }, [airlineCode, arrivalFlightNumber]);

  const departureFlight = useMemo(() => {
    if (typeof airlineCode !== 'string' || typeof departureFlightNumber !== 'string') return null;
    return (
      getDeparturesForAirline(airlineCode).find((f) => f.value === departureFlightNumber)?.flight ??
      null
    );
  }, [airlineCode, departureFlightNumber]);

  // Use arrival date as the experience filter date (layover starts on arrival)
  const layover: CrewLayover | null = useMemo(() => {
    if (!arrivalFlight || !departureFlight || !arrivalDateStr) return null;
    return { arrival: arrivalFlight, departure: departureFlight, dateStr: arrivalDateStr };
  }, [arrivalFlight, departureFlight, arrivalDateStr]);

  const handleContinue = () => {
    if (layover) {
      setSelectedCrewLayover(layover);
      router.push('/(drawer)/(tabs)');
    }
  };

  const canContinue = Boolean(layover);

  return (
    <View className="flex-1 bg-background">
      <Header title="Crew" rightComponents={[]} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <ThemedText
          className="mb-2 mt-2"
          style={{ fontSize: 22, fontWeight: '700', color: colors.text, letterSpacing: -0.5 }}>
          Your layover
        </ThemedText>
        <ThemedText className="mb-6" style={{ color: colors.textMuted }}>
          Select your arrival and departure flights plus the date to see experiences that fit your
          window.
        </ThemedText>

        {/* 1. Airline */}
        <Select
          label="Airline"
          placeholder="Select airline"
          options={airlineOptions}
          value={airlineCode}
          onChange={(v) => {
            setAirlineCode(v);
            setArrivalDateStr(undefined);
            setArrivalFlightNumber(undefined);
            setDepartureDateStr(undefined);
            setDepartureFlightNumber(undefined);
          }}
          variant="classic"
          containerClassName="mb-4"
        />

        {/* 2. Arrival date */}
        {airlineCode != null && (
          <>
            <ThemedText className="mb-2 font-medium" style={{ color: colors.text }}>
              Arrival date
            </ThemedText>
            <FlightDateCalendar
              availableDates={availableDates}
              value={arrivalDateStr ?? null}
              onChange={(v) => {
                setArrivalDateStr(v);
                setArrivalFlightNumber(undefined);
                setDepartureDateStr(undefined);
                setDepartureFlightNumber(undefined);
              }}
              className="mb-4"
            />
          </>
        )}

        {/* 3. Arrival flight */}
        {airlineCode != null && arrivalDateStr != null && (
          <Select
            label="Arrival flight (into MLE)"
            placeholder="Select arrival"
            options={arrivalOptions}
            value={arrivalFlightNumber}
            onChange={(v) => {
              setArrivalFlightNumber(v);
              setDepartureDateStr(undefined);
              setDepartureFlightNumber(undefined);
            }}
            variant="classic"
            containerClassName="mb-4"
          />
        )}

        {/* 4. Departure date */}
        {airlineCode != null && arrivalDateStr != null && arrivalFlightNumber != null && (
          <>
            <ThemedText className="mb-2 font-medium" style={{ color: colors.text }}>
              Departure date
            </ThemedText>
            <FlightDateCalendar
              availableDates={availableDates}
              value={departureDateStr ?? null}
              onChange={(v) => {
                setDepartureDateStr(v);
                setDepartureFlightNumber(undefined);
              }}
              className="mb-4"
            />
          </>
        )}

        {/* 5. Departure flight */}
        {airlineCode != null &&
          arrivalDateStr != null &&
          arrivalFlightNumber != null &&
          departureDateStr != null && (
            <Select
              label="Departure flight (from MLE)"
              placeholder="Select departure"
              options={departureOptions}
              value={departureFlightNumber}
              onChange={setDepartureFlightNumber}
              variant="classic"
              containerClassName="mb-4"
            />
          )}

        {canContinue && (
          <Button
            title="See experiences"
            onPress={handleContinue}
            size="large"
            variant="cta"
            rounded="full"
          />
        )}
      </ScrollView>
    </View>
  );
}
