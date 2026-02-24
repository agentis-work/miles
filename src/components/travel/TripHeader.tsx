import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Trip } from '../../models/trip';
import { useTheme } from '../../theme/useTheme';
import { formatDateRange } from '../../utils/date';
import { Chip } from '../ui/Chip';

interface TripHeaderProps {
  trip: Trip;
}

export const TripHeader = ({ trip }: TripHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[theme.typography.h1, { color: theme.colors.textPrimary }]}>{trip.destination}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{trip.country} • {formatDateRange(trip.dateStart, trip.dateEnd)}</Text>
      <View style={styles.chips}>
        <Chip label={trip.status} />
        <Chip label={trip.pace} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  subtitle: {
    fontSize: 15,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
});