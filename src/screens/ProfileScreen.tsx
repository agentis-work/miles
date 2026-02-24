import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../state/AppStore';
import { useTheme } from '../theme/useTheme';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';

export const ProfileScreen = () => {
  const { state, setMembershipState, selectTrip, resetToSeedData } = useAppStore();
  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card>
        <SectionHeader title="Membership (Mock)" />
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>Status: {state.membershipState.hasMembership ? 'Member' : 'Free tier'}</Text>
        <Text style={[styles.subtle, { color: theme.colors.textSecondary }]}>User-created trips: {state.membershipState.userCreatedTripCount}</Text>
        <View style={styles.row}>
          <Button
            label={state.membershipState.hasMembership ? 'Disable Membership' : 'Enable Membership'}
            onPress={() =>
              setMembershipState({
                ...state.membershipState,
                hasMembership: !state.membershipState.hasMembership,
              })
            }
          />
        </View>
      </Card>

      <Card>
        <SectionHeader title="Debug Controls" />
        <View style={styles.list}>
          <Button label="Reset to seed data" variant="secondary" onPress={resetToSeedData} />
          <Button label="Clear Selected Trip" variant="secondary" onPress={() => selectTrip('')} />
          {state.trips.map((trip) => (
            <Button
              key={trip.id}
              label={`Select ${trip.destination}${trip.id === state.selectedTripId ? ' (Current)' : ''}`}
              onPress={() => selectTrip(trip.id)}
              variant={trip.id === state.selectedTripId ? 'primary' : 'secondary'}
            />
          ))}
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
  subtle: {
    marginTop: 6,
    fontSize: 13,
  },
  row: {
    marginTop: 12,
  },
  list: {
    marginTop: 12,
    gap: 8,
  },
});