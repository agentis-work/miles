import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TripsStackParamList } from '../app/navigation/TripsStack';
import { useAppStore } from '../state/AppStore';
import { BookingCard } from '../components/travel/BookingCard';
import { EmptyState } from '../components/ui/EmptyState';

type Props = NativeStackScreenProps<TripsStackParamList, 'Bookings'>;

export const BookingsScreen = ({ route }: Props) => {
  const { state } = useAppStore();
  const bookings = state.bookings.filter((item) => item.tripId === route.params.tripId);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Add flights and stays in a later setup step." />
      ) : (
        bookings.map((booking) => <BookingCard booking={booking} key={booking.id} />)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
});