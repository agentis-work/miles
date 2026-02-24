import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Hero } from '../components/ui/Hero';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { imageByKey } from '../mock/images';
import { getPlanOptionById } from '../mock/aiMocks';
import { useAppStore } from '../state/AppStore';
import { selectCurrentTrip } from '../state/selectors';
import { useTheme } from '../theme/useTheme';
import { formatDateRange } from '../utils/date';

const getDaysToGo = (start: string) => {
  const target = new Date(start).getTime();
  const now = new Date().getTime();
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
};

export const PrepareDashboardScreen = () => {
  const { state, advanceTripStatus } = useAppStore();
  const navigation = useNavigation();
  const theme = useTheme();
  const trip = selectCurrentTrip(state);

  if (!trip || trip.status !== 'preparing') {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <EmptyState
          title="Prepare mode appears here"
          description="Select a preparing trip to view bookings, checklist, and practical guidance."
          actionLabel="Go to Trips"
          onActionPress={() => (navigation as any).navigate('TripsTab')}
        />
      </ScrollView>
    );
  }

  const completion = 64;
  const plan = trip.selectedOptionId ? getPlanOptionById(trip.id, trip.selectedOptionId) : null;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Hero
        imageUri={imageByKey[trip.coverImageKey] ?? imageByKey.default}
        title={`${trip.destination}, ${trip.country || 'Destination'}`}
        subtitle={formatDateRange(trip.dateStart, trip.dateEnd)}
        helperText={`${getDaysToGo(trip.dateStart)} days to go`}
        height={240}
      />

      <Card>
        <View style={styles.progressRow}>
          <View style={[styles.ring, { borderColor: theme.colors.accent }]}>
            <Text style={[styles.ringText, { color: theme.colors.textPrimary }]}>{completion}%</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Ready to depart</Text>
            <Text style={[styles.progressMeta, { color: theme.colors.textSecondary }]}>Checklist progress is mocked for this phase.</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Bookings</Text>
        <Text style={[styles.cardMeta, { color: theme.colors.textSecondary }]}>Manage flights, stay, and transfer confirmations.</Text>
        <View style={styles.cardAction}>
          <Button label="Open bookings" onPress={() => (navigation as any).navigate('TripsTab', { screen: 'Bookings', params: { tripId: trip.id } })} />
        </View>
      </Card>

      <Card>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Checklist</Text>
        <Text style={[styles.line, { color: theme.colors.textSecondary }]}>- Passport and visa ready</Text>
        <Text style={[styles.line, { color: theme.colors.textSecondary }]}>- Transfer details confirmed</Text>
        <Text style={[styles.line, { color: theme.colors.textSecondary }]}>- Essentials packed</Text>
      </Card>

      <Card>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Trip Framework</Text>
        <Text style={[styles.cardMeta, { color: theme.colors.textSecondary }]}>
          {plan ? plan.title : 'Select a planning framework to structure your days.'}
        </Text>
        {plan ? (
          <View style={styles.cardAction}>
            <Button
              label="View framework"
              variant="secondary"
              onPress={() =>
                (navigation as any).navigate('TripsTab', {
                  screen: 'PlanOptionDetail',
                  params: { tripId: trip.id, optionId: plan.id },
                })
              }
            />
          </View>
        ) : null}
      </Card>

      <Card>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Practical Notes</Text>
        <Text style={[styles.line, { color: theme.colors.textSecondary }]}>- Keep digital copies of documents.</Text>
        <Text style={[styles.line, { color: theme.colors.textSecondary }]}>- Confirm airport transfer 24h before departure.</Text>
      </Card>

      <Text style={[styles.debug, { color: theme.colors.textSecondary }]} onPress={() => advanceTripStatus(trip.id)}>
        Start trip (debug)
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ring: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressMeta: {
    marginTop: 4,
    fontSize: 13,
  },
  cardMeta: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  cardAction: {
    marginTop: 10,
  },
  line: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  debug: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});