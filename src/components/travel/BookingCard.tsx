import React from 'react';
import { Text } from 'react-native';
import { Card } from '../ui/Card';
import { Booking } from '../../models/booking';
import { useTheme } from '../../theme/useTheme';

interface BookingCardProps {
  booking: Booking;
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const theme = useTheme();
  return (
    <Card>
      <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>{booking.title}</Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: 6 }]}>{booking.subtitle}</Text>
    </Card>
  );
};