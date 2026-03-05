import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TripsStackParamList } from '../app/navigation/TripsStack';
import { PaywallModal } from '../components/travel/PaywallModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { InlineHeader } from '../components/ui/InlineHeader';
import { coverImageKeys } from '../mock/images';
import { Trip, TravelPace, TravelersType } from '../models/trip';
import { useAppStore } from '../state/AppStore';
import { selectCanCreateTrip } from '../state/selectors';
import { useTheme } from '../theme/useTheme';
import { createId } from '../utils/id';

type Props = NativeStackScreenProps<TripsStackParamList, 'CreateTrip'>;

const travelersOptions: { label: string; value: TravelersType }[] = [
  { label: 'Solo', value: 'solo' },
  { label: 'Couple', value: 'couple' },
  { label: 'Family', value: 'family' },
  { label: 'Group', value: 'group' },
];

const paceOptions: { label: string; value: TravelPace }[] = [
  { label: 'Relaxed', value: 'relaxed' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Packed', value: 'packed' },
];

const interestOptions = [
  'Food',
  'Architecture',
  'Museums',
  'Nature',
  'Nightlife',
  'Markets',
  'Design',
  'Wellness',
  'Shopping',
  'Photography',
];

const Segmented = <T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.segment, { backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.spacing.md }]}> 
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Button
            key={option.value}
            label={option.label}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(option.value);
            }}
            variant={active ? 'primary' : 'secondary'}
            style={styles.segmentButton}
          />
        );
      })}
    </View>
  );
};

export const CreateTripScreen = ({ navigation, route }: Props) => {
  const { state, createTrip, setMembershipState } = useAppStore();
  const theme = useTheme();

  const [destination, setDestination] = useState(route.params?.destinationPrefill ?? '');
  const [country, setCountry] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [travelersType, setTravelersType] = useState<TravelersType>('solo');
  const [pace, setPace] = useState<TravelPace>('balanced');
  const [interests, setInterests] = useState<string[]>([]);
  const [showPaywall, setShowPaywall] = useState(false);

  const canCreateTrip = selectCanCreateTrip(state);

  const validationError = useMemo(() => {
    if (!destination.trim()) {
      return 'Destination is required.';
    }

    if ((dateStart && !dateEnd) || (!dateStart && dateEnd)) {
      return 'Set both start and end dates, or leave both empty.';
    }

    return null;
  }, [destination, dateStart, dateEnd]);

  const toggleInterest = (item: string) => {
    Haptics.selectionAsync();
    setInterests((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));
  };

  const onSubmit = () => {
    if (!canCreateTrip) {
      setShowPaywall(true);
      return;
    }

    if (validationError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const userTripCount = state.membershipState.userCreatedTripCount;
    const coverImageKey = coverImageKeys[userTripCount % coverImageKeys.length] ?? 'default';
    const newTrip: Trip = {
      id: createId('trip_user'),
      destination: destination.trim(),
      country: country.trim(),
      dateStart: dateStart.trim() || new Date().toISOString().slice(0, 10),
      dateEnd: dateEnd.trim() || new Date().toISOString().slice(0, 10),
      travelersType,
      pace,
      interests: interests.map((item) => item.toLowerCase()),
      status: 'planning',
      coverImageKey,
      createdAt: new Date().toISOString(),
    };

    createTrip(newTrip);
    navigation.replace('TripTimeline', {
      tripId: newTrip.id,
      destination: newTrip.destination,
      startISO: newTrip.dateStart,
      endISO: newTrip.dateEnd,
      country: newTrip.country,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <InlineHeader onBackPress={() => navigation.goBack()} />
          <Card>
            <Text style={[theme.typography.h2, { color: theme.colors.textPrimary }]}>Create a new trip</Text>
            <Text style={[styles.subtitle, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>Set up your next itinerary with Miles.</Text>

            <Text style={[styles.label, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>Destination</Text>
            <TextInput
              value={destination}
              onChangeText={setDestination}
              placeholder="e.g. Kyoto"
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.input, theme.typography.button, { borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary, borderRadius: theme.spacing.md }]}
            />

            <Text style={[styles.label, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>Country (optional)</Text>
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="e.g. Japan"
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.input, theme.typography.button, { borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary, borderRadius: theme.spacing.md }]}
            />

            <View style={styles.rowInputs}>
              <View style={styles.flexInput}>
                <Text style={[styles.label, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>Start</Text>
                <TextInput
                  value={dateStart}
                  onChangeText={setDateStart}
                  placeholder="YYYY-MM-DD"
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={[styles.input, theme.typography.button, { borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary, borderRadius: theme.spacing.md }]}
                />
              </View>

              <View style={styles.flexInput}>
                <Text style={[styles.label, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>End</Text>
                <TextInput
                  value={dateEnd}
                  onChangeText={setDateEnd}
                  placeholder="YYYY-MM-DD"
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={[styles.input, theme.typography.button, { borderColor: theme.colors.cardBorder, color: theme.colors.textPrimary, borderRadius: theme.spacing.md }]}
                />
              </View>
            </View>

            <Text style={[styles.label, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>Travelers</Text>
            <Segmented value={travelersType} options={travelersOptions} onChange={setTravelersType} />

            <Text style={[styles.label, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>Pace</Text>
            <Segmented value={pace} options={paceOptions} onChange={setPace} />

            <Text style={[styles.label, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>Interests</Text>
            <View style={styles.interestsWrap}>
              {interestOptions.map((interest) => {
                const selected = interests.includes(interest);
                return <Chip key={interest} label={interest} selected={selected} onPress={() => toggleInterest(interest)} />;
              })}
            </View>

            {validationError ? <Text style={[styles.error, theme.typography.bodyStrongSmall, { color: theme.colors.danger }]}>{validationError}</Text> : null}
          </Card>
        </ScrollView>

        <View style={[styles.stickyBar, { backgroundColor: `${theme.colors.background}F0`, borderTopColor: theme.colors.cardBorder }]}> 
          <Button label="Create trip" onPress={onSubmit} disabled={Boolean(validationError)} />
        </View>

        <PaywallModal
          visible={showPaywall}
          onClose={() => setShowPaywall(false)}
          onEnableMembership={() => {
            setMembershipState({
              ...state.membershipState,
              hasMembership: true,
            });
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  flexInput: {
    flex: 1,
  },
  segment: {
    padding: 6,
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  segmentButton: {
    flexGrow: 1,
    minWidth: 74,
  },
  interestsWrap: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  error: {
    marginTop: 14,
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
  },
});
