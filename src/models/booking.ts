export type BookingType = 'flight' | 'stay' | 'transport';

export interface Booking {
  id: string;
  tripId: string;
  type: BookingType;
  title: string;
  subtitle: string;
  dateTime?: string;
  metadata: Record<string, string>;
  screenshotUri?: string;
}