import AsyncStorage from '@react-native-async-storage/async-storage';
import { SeedData } from '../mock/seed';

const STORAGE_KEYS = {
  trips: 'miles.trips',
  selectedTripId: 'miles.selectedTripId',
  membershipState: 'miles.membershipState',
  bookings: 'miles.bookings',
  memories: 'miles.memories',
  exploreSuggestions: 'miles.exploreSuggestions',
  eventsByTripId: 'miles.eventsByTripId',
  recapsByTripId: 'miles.recapsByTripId',
  legacyTraveloguesByTripId: 'miles.traveloguesByTripId',
};

export interface PersistedState {
  trips: SeedData['trips'];
  selectedTripId: string;
  membershipState: SeedData['membershipState'];
  bookings: SeedData['bookings'];
  memories: SeedData['memories'];
  exploreSuggestions: SeedData['exploreSuggestions'];
  eventsByTripId: SeedData['eventsByTripId'];
  recapsByTripId: SeedData['recapsByTripId'];
}

const parseStoredJson = <T>(raw: string | null): T | undefined => {
  if (!raw || raw === 'undefined' || raw === 'null') {
    return undefined;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
};

export const loadPersistedState = async (): Promise<Partial<PersistedState>> => {
  const [
    trips,
    selectedTripId,
    membershipState,
    bookings,
    memories,
    exploreSuggestions,
    eventsByTripId,
    recapsByTripId,
    legacyTraveloguesByTripId,
  ] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEYS.trips),
    AsyncStorage.getItem(STORAGE_KEYS.selectedTripId),
    AsyncStorage.getItem(STORAGE_KEYS.membershipState),
    AsyncStorage.getItem(STORAGE_KEYS.bookings),
    AsyncStorage.getItem(STORAGE_KEYS.memories),
    AsyncStorage.getItem(STORAGE_KEYS.exploreSuggestions),
    AsyncStorage.getItem(STORAGE_KEYS.eventsByTripId),
    AsyncStorage.getItem(STORAGE_KEYS.recapsByTripId),
    AsyncStorage.getItem(STORAGE_KEYS.legacyTraveloguesByTripId),
  ]);

  const parsedRecaps = parseStoredJson<PersistedState['recapsByTripId']>(recapsByTripId)
    ?? parseStoredJson<PersistedState['recapsByTripId']>(legacyTraveloguesByTripId);

  if (!recapsByTripId && legacyTraveloguesByTripId) {
    await AsyncStorage.setItem(STORAGE_KEYS.recapsByTripId, legacyTraveloguesByTripId);
    await AsyncStorage.removeItem(STORAGE_KEYS.legacyTraveloguesByTripId);
  }

  return {
    trips: parseStoredJson<PersistedState['trips']>(trips),
    selectedTripId: selectedTripId && selectedTripId !== 'undefined' ? selectedTripId : undefined,
    membershipState: parseStoredJson<PersistedState['membershipState']>(membershipState),
    bookings: parseStoredJson<PersistedState['bookings']>(bookings),
    memories: parseStoredJson<PersistedState['memories']>(memories),
    exploreSuggestions: parseStoredJson<PersistedState['exploreSuggestions']>(exploreSuggestions),
    eventsByTripId: parseStoredJson<PersistedState['eventsByTripId']>(eventsByTripId),
    recapsByTripId: parsedRecaps,
  };
};

export const persistState = async (state: PersistedState) => {
  await Promise.all([
    AsyncStorage.setItem(STORAGE_KEYS.trips, JSON.stringify(state.trips)),
    AsyncStorage.setItem(STORAGE_KEYS.selectedTripId, state.selectedTripId),
    AsyncStorage.setItem(STORAGE_KEYS.membershipState, JSON.stringify(state.membershipState)),
    AsyncStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(state.bookings)),
    AsyncStorage.setItem(STORAGE_KEYS.memories, JSON.stringify(state.memories)),
    AsyncStorage.setItem(STORAGE_KEYS.exploreSuggestions, JSON.stringify(state.exploreSuggestions)),
    AsyncStorage.setItem(STORAGE_KEYS.eventsByTripId, JSON.stringify(state.eventsByTripId)),
    AsyncStorage.setItem(STORAGE_KEYS.recapsByTripId, JSON.stringify(state.recapsByTripId)),
  ]);
};
