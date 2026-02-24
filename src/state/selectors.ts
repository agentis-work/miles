import { TripStatus } from '../models/trip';
import { AppState } from './AppStore';

const statusPillByMode: Record<TripStatus, string> = {
  planning: 'Planning',
  preparing: 'Preparing',
  active: 'Exploring',
  completed: 'Reflect',
};

export const selectCurrentTrip = (state: AppState) => {
  return state.trips.find((trip) => trip.id === state.selectedTripId) ?? null;
};

export const selectSelectedTrip = (state: AppState) => {
  return selectCurrentTrip(state) ?? state.trips[0] ?? null;
};

export const selectSelectedTripStatus = (state: AppState): TripStatus | null => {
  return selectCurrentTrip(state)?.status ?? null;
};

export const selectLifecycleKey = (state: AppState): TripStatus => {
  return selectSelectedTripStatus(state) ?? 'planning';
};

export const selectCurrentMode = (state: AppState) => {
  return selectSelectedTripStatus(state) ?? 'planning';
};

export const selectActiveTrip = (state: AppState) => {
  return state.trips.find((trip) => trip.status === 'active') ?? null;
};

export const selectCompletedTrip = (state: AppState) => {
  return state.trips.find((trip) => trip.status === 'completed') ?? null;
};

export const selectBookingsForSelectedTrip = (state: AppState) => {
  return state.bookings.filter((booking) => booking.tripId === state.selectedTripId);
};

export const selectMemoriesForSelectedTrip = (state: AppState) => {
  return state.memories.filter((memory) => memory.tripId === state.selectedTripId);
};

export const selectEventsForSelectedTrip = (state: AppState) => {
  return state.eventsByTripId[state.selectedTripId] ?? [];
};

export const selectRecapForSelectedTrip = (state: AppState) => {
  return state.recapsByTripId[state.selectedTripId] ?? null;
};

export const selectCanCreateTrip = (state: AppState) => {
  if (state.membershipState.hasMembership) {
    return true;
  }
  return state.membershipState.userCreatedTripCount < 1;
};

export const getStatusPillLabel = (status: TripStatus) => {
  return statusPillByMode[status];
};