import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TripsStackParamList } from '../app/navigation/TripsStack';
import { Hero } from '../components/ui/Hero';
import { InlineHeader } from '../components/ui/InlineHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { imageByKey } from '../mock/images';
import { TripStatus } from '../models/trip';
import { useAppStore } from '../state/AppStore';
import { getStatusPillLabel } from '../state/selectors';
import { useTheme } from '../theme/useTheme';
import { formatDateRange } from '../utils/date';

type Props = NativeStackScreenProps<TripsStackParamList, 'TripDetail'>;

const nextStepByStatus: Record<TripStatus, string> = {
  planning: 'Choose a plan that fits your travel style.',
  preparing: 'Add bookings and get ready.',
  active: 'Live concierge guidance nearby.',
  completed: 'Your story and recap highlights.',
};

export const TripDetailScreen = ({ route, navigation }: Props) => {
  const { state, selectTrip, advanceTripStatus } = useAppStore();
  const theme = useTheme();
  const trip = state.trips.find((item) => item.id === route.params.tripId);

  useEffect(() => {
    if (trip && trip.id !== state.selectedTripId) {
      selectTrip(trip.id);
    }
  }, [trip, state.selectedTripId, selectTrip]);

  if (!trip) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.colors.textSecondary }}>Trip not found.</Text>
      </View>
    );
  }

  const openPrimaryAction = () => {
    if (trip.status === 'planning') {
      navigation.navigate('PlanOptions', { tripId: trip.id });
      return;
    }

    navigation.getParent()?.navigate('LifecycleTab' as never);
  };

  const primaryLabelByStatus: Record<TripStatus, string> = {
    planning: 'Choose a plan',
    preparing: 'Open dashboard',
    active: 'Open Explore',
    completed: 'Open Reflect',
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Hero
        imageSource={imageByKey[trip.coverImageKey] ?? imageByKey.default}
        title={`${trip.destination}, ${trip.country || 'Destination'}`}
        subtitle={formatDateRange(trip.dateStart, trip.dateEnd)}
        helperText={nextStepByStatus[trip.status]}
      />
      <InlineHeader onBackPress={() => navigation.goBack()} />

      <Card>
        <View style={styles.rowBetween}>
          <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Mode Hub</Text>
          <Chip label={getStatusPillLabel(trip.status)} selected />
        </View>
        <Text style={[styles.nextStep, theme.typography.button, { color: theme.colors.textSecondary }]}>{nextStepByStatus[trip.status]}</Text>

        <View style={styles.primaryArea}>
          <Button label={primaryLabelByStatus[trip.status]} onPress={openPrimaryAction} />
        </View>

        <View style={styles.quickRow}>
          <Button label="Bookings" variant="secondary" style={styles.quickButton} onPress={() => navigation.navigate('Bookings', { tripId: trip.id })} />
          <Button
            label="Checklist"
            variant="secondary"
            style={styles.quickButton}
            onPress={() => Alert.alert('Checklist', 'Checklist screen placeholder is ready for the next pass.')}
          />
          <Button
            label="Notes"
            variant="secondary"
            style={styles.quickButton}
            onPress={() => Alert.alert('Notes', 'Notes screen placeholder is ready for the next pass.')}
          />
        </View>

        <Text onPress={() => advanceTripStatus(trip.id)} style={[styles.advanceDebug, theme.typography.overline, { color: theme.colors.textSecondary }]}>
          Advance Status (debug)
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 28,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextStep: {
    marginTop: 10,
    lineHeight: 22,
  },
  primaryArea: {
    marginTop: 14,
  },
  quickRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickButton: {
    minWidth: 108,
  },
  advanceDebug: {
    marginTop: 14,
  },
});
