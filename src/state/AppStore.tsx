import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Booking } from '../models/booking';
import { ExploreSuggestion, SuggestionCategory } from '../models/explore';
import { TripEvent, TripEventType } from '../models/events';
import { MemoryItem } from '../models/memory';
import { MembershipState } from '../models/membership';
import { Recap } from '../models/recap';
import { Trip, TripStatus } from '../models/trip';
import { getPlanOptionById } from '../mock/aiMocks';
import { buildRecap } from '../mock/recapMocks';
import { seedData } from '../mock/seed';
import { createId } from '../utils/id';
import { loadPersistedState, PersistedState, persistState } from './persistence';

export interface AppState extends PersistedState {
  isHydrated: boolean;
}

type AppAction =
  | { type: 'HYDRATE'; payload: PersistedState }
  | { type: 'RESET_TO_SEED' }
  | { type: 'SELECT_TRIP'; payload: string }
  | { type: 'SET_MEMBERSHIP'; payload: MembershipState }
  | { type: 'SET_TRIPS'; payload: Trip[] }
  | { type: 'CREATE_TRIP'; payload: Trip }
  | { type: 'ADVANCE_TRIP_STATUS'; payload: string }
  | { type: 'SELECT_TRIP_PLAN'; payload: { tripId: string; optionId: string } }
  | { type: 'SET_BOOKINGS'; payload: Booking[] }
  | { type: 'SET_MEMORIES'; payload: MemoryItem[] }
  | { type: 'SET_EXPLORE_SUGGESTIONS'; payload: ExploreSuggestion[] }
  | { type: 'LOG_TRIP_EVENT'; payload: TripEvent }
  | { type: 'SAVE_SUGGESTION'; payload: { event: TripEvent } }
  | { type: 'SELECT_SUGGESTION'; payload: { event: TripEvent; memory: MemoryItem } }
  | { type: 'CHANGE_AREA'; payload: { tripId: string; event: TripEvent; suggestions: ExploreSuggestion[] } }
  | { type: 'ADD_MEMORY'; payload: { event: TripEvent; memory: MemoryItem } }
  | { type: 'GENERATE_RECAP'; payload: Recap }
  | { type: 'COMPLETE_TRIP'; payload: { tripId: string; event: TripEvent; recap: Recap } };

const initialState: AppState = {
  trips: seedData.trips,
  selectedTripId: seedData.selectedTripId,
  bookings: seedData.bookings,
  memories: seedData.memories,
  exploreSuggestions: seedData.exploreSuggestions,
  membershipState: seedData.membershipState,
  eventsByTripId: seedData.eventsByTripId,
  recapsByTripId: seedData.recapsByTripId,
  isHydrated: false,
};

const statusOrder: TripStatus[] = ['planning', 'preparing', 'active', 'completed'];

const areaPresets: Record<string, string[]> = {
  Copenhagen: ['Nyhavn', 'Norrebro', 'Vesterbro', 'Christianshavn'],
  Lisbon: ['Alfama', 'Chiado', 'Belem', 'Bairro Alto'],
  Kyoto: ['Gion', 'Arashiyama', 'Higashiyama', 'Fushimi'],
  Marrakech: ['Medina', 'Gueliz', 'Hivernage', 'Kasbah'],
  Florida: ['South Beach', 'Key West', 'Orlando', 'Everglades'],
  Hyderabad: ['Charminar', 'Banjara Hills', 'Hitech City', 'Golconda'],
};

const suggestionTemplates: Array<{
  category: SuggestionCategory;
  title: string;
  reason: string;
}> = [
  { category: 'food', title: 'Seasonal tasting spot', reason: 'Great timing for your current pace and appetite.' },
  { category: 'culture', title: 'Design-forward gallery stop', reason: 'Aligns with your interest profile right now.' },
  { category: 'nature', title: 'Scenic green route', reason: 'Good light and weather window this hour.' },
  { category: 'nightlife', title: 'After-dark local lounge', reason: 'High-rated for relaxed evening energy.' },
  { category: 'shopping', title: 'Independent craft street', reason: 'Strong match for curated local finds.' },
];

const getNextStatus = (status: TripStatus): TripStatus => {
  const index = statusOrder.indexOf(status);
  if (index < 0 || index === statusOrder.length - 1) {
    return 'completed';
  }
  return statusOrder[index + 1];
};

const appendEvent = (state: AppState, event: TripEvent) => ({
  ...state.eventsByTripId,
  [event.tripId]: [...(state.eventsByTripId[event.tripId] ?? []), event],
});

const buildExploreSuggestions = (trip: Trip, areaName: string): ExploreSuggestion[] => {
  const areaSeed = areaName.length % suggestionTemplates.length;

  return suggestionTemplates.slice(0, 4).map((_, index) => {
    const rotated = suggestionTemplates[(index + areaSeed) % suggestionTemplates.length];

    return {
      id: createId('explore'),
      tripId: trip.id,
      areaName,
      category: rotated.category,
      title: `${rotated.title} - ${areaName}`,
      reason: rotated.reason,
      distanceLabel: `${6 + index * 4} min walk`,
      imageKey: trip.coverImageKey,
    };
  });
};

const buildEvent = (tripId: string, type: TripEventType, payload: Record<string, any>): TripEvent => ({
  id: createId('event'),
  tripId,
  type,
  createdAt: new Date().toISOString(),
  payload,
});

const buildRecapForTrip = (state: AppState, tripId: string): Recap | null => {
  const trip = state.trips.find((item) => item.id === tripId);
  if (!trip) {
    return null;
  }

  const memories = state.memories.filter((memory) => memory.tripId === tripId);
  const events = state.eventsByTripId[tripId] ?? [];
  const selectedPlan = trip.selectedOptionId ? getPlanOptionById(trip.id, trip.selectedOptionId) : null;

  return buildRecap({
    trip,
    memories,
    events,
    selectedPlan,
  });
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, isHydrated: true };
    case 'RESET_TO_SEED':
      return {
        ...initialState,
        isHydrated: true,
      };
    case 'SELECT_TRIP':
      return { ...state, selectedTripId: action.payload };
    case 'SET_MEMBERSHIP':
      return { ...state, membershipState: action.payload };
    case 'SET_TRIPS':
      return { ...state, trips: action.payload };
    case 'CREATE_TRIP':
      return {
        ...state,
        trips: [action.payload, ...state.trips],
        selectedTripId: action.payload.id,
        membershipState: {
          ...state.membershipState,
          userCreatedTripCount: state.membershipState.userCreatedTripCount + 1,
        },
      };
    case 'ADVANCE_TRIP_STATUS':
      return {
        ...state,
        trips: state.trips.map((trip) =>
          trip.id === action.payload
            ? {
                ...trip,
                status: getNextStatus(trip.status),
              }
            : trip,
        ),
      };
    case 'SELECT_TRIP_PLAN':
      return {
        ...state,
        selectedTripId: action.payload.tripId,
        trips: state.trips.map((trip) =>
          trip.id === action.payload.tripId
            ? {
                ...trip,
                selectedOptionId: action.payload.optionId,
                status: 'preparing',
              }
            : trip,
        ),
      };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
    case 'SET_MEMORIES':
      return { ...state, memories: action.payload };
    case 'SET_EXPLORE_SUGGESTIONS':
      return { ...state, exploreSuggestions: action.payload };
    case 'LOG_TRIP_EVENT':
      return {
        ...state,
        eventsByTripId: appendEvent(state, action.payload),
      };
    case 'SAVE_SUGGESTION':
      return {
        ...state,
        eventsByTripId: appendEvent(state, action.payload.event),
      };
    case 'SELECT_SUGGESTION':
      return {
        ...state,
        memories: [action.payload.memory, ...state.memories],
        eventsByTripId: appendEvent(state, action.payload.event),
      };
    case 'CHANGE_AREA':
      return {
        ...state,
        eventsByTripId: appendEvent(state, action.payload.event),
        exploreSuggestions: [
          ...state.exploreSuggestions.filter((item) => item.tripId !== action.payload.tripId),
          ...action.payload.suggestions,
        ],
      };
    case 'ADD_MEMORY':
      return {
        ...state,
        memories: [action.payload.memory, ...state.memories],
        eventsByTripId: appendEvent(state, action.payload.event),
      };
    case 'GENERATE_RECAP':
      return {
        ...state,
        recapsByTripId: {
          ...state.recapsByTripId,
          [action.payload.tripId]: action.payload,
        },
      };
    case 'COMPLETE_TRIP':
      return {
        ...state,
        trips: state.trips.map((trip) =>
          trip.id === action.payload.tripId
            ? {
                ...trip,
                status: 'completed',
              }
            : trip,
        ),
        eventsByTripId: appendEvent(state, action.payload.event),
        recapsByTripId: {
          ...state.recapsByTripId,
          [action.payload.tripId]: action.payload.recap,
        },
      };
    default:
      return state;
  }
};

interface AppStoreValue {
  state: AppState;
  selectTrip: (tripId: string) => void;
  setMembershipState: (membershipState: MembershipState) => void;
  createTrip: (trip: Trip) => void;
  advanceTripStatus: (tripId: string) => void;
  selectPlanForTrip: (tripId: string, optionId: string) => void;
  logTripEvent: (tripId: string, type: TripEventType, payload: Record<string, any>) => void;
  saveSuggestion: (tripId: string, suggestion: ExploreSuggestion) => void;
  selectSuggestion: (tripId: string, suggestion: ExploreSuggestion) => void;
  changeArea: (tripId: string, areaName: string) => void;
  addMemory: (tripId: string, payload: Omit<MemoryItem, 'id' | 'timestamp' | 'tripId'>) => void;
  generateRecap: (tripId: string) => void;
  completeTrip: (tripId: string) => void;
  resetToSeedData: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export const AppStoreProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const persisted = await loadPersistedState();
      const hasPersistedTrips = Array.isArray(persisted.trips) && persisted.trips.length > 0;
      const membershipSource = persisted.membershipState;
      const hydrated: PersistedState = {
        trips: hasPersistedTrips ? persisted.trips! : seedData.trips,
        selectedTripId: persisted.selectedTripId ?? seedData.selectedTripId,
        bookings: persisted.bookings ?? seedData.bookings,
        memories: persisted.memories ?? seedData.memories,
        exploreSuggestions: persisted.exploreSuggestions ?? seedData.exploreSuggestions,
        eventsByTripId: persisted.eventsByTripId ?? seedData.eventsByTripId,
        recapsByTripId: persisted.recapsByTripId ?? seedData.recapsByTripId,
        membershipState: {
          hasMembership: membershipSource?.hasMembership ?? seedData.membershipState.hasMembership,
          userCreatedTripCount: typeof membershipSource?.userCreatedTripCount === 'number' ? membershipSource.userCreatedTripCount : 0,
        },
      };

      dispatch({ type: 'HYDRATE', payload: hydrated });
      setIsBootstrapping(false);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (isBootstrapping || !state.isHydrated) {
      return;
    }

    persistState({
      trips: state.trips,
      selectedTripId: state.selectedTripId,
      membershipState: state.membershipState,
      bookings: state.bookings,
      memories: state.memories,
      exploreSuggestions: state.exploreSuggestions,
      eventsByTripId: state.eventsByTripId,
      recapsByTripId: state.recapsByTripId,
    });
  }, [state, isBootstrapping]);

  const value = useMemo<AppStoreValue>(() => {
    return {
      state,
      selectTrip: (tripId: string) => {
        Haptics.selectionAsync();
        dispatch({ type: 'SELECT_TRIP', payload: tripId });
      },
      setMembershipState: (membershipState) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        dispatch({ type: 'SET_MEMBERSHIP', payload: membershipState });
      },
      createTrip: (trip) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        dispatch({ type: 'CREATE_TRIP', payload: trip });
      },
      advanceTripStatus: (tripId) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        dispatch({ type: 'ADVANCE_TRIP_STATUS', payload: tripId });
      },
      selectPlanForTrip: (tripId, optionId) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        dispatch({ type: 'SELECT_TRIP_PLAN', payload: { tripId, optionId } });
      },
      logTripEvent: (tripId, type, payload) => {
        dispatch({ type: 'LOG_TRIP_EVENT', payload: buildEvent(tripId, type, payload) });
      },
      saveSuggestion: (tripId, suggestion) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        dispatch({
          type: 'SAVE_SUGGESTION',
          payload: {
            event: buildEvent(tripId, 'suggestion_saved', {
              suggestionId: suggestion.id,
              title: suggestion.title,
              category: suggestion.category,
              areaName: suggestion.areaName,
            }),
          },
        });
      },
      selectSuggestion: (tripId, suggestion) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        dispatch({
          type: 'SELECT_SUGGESTION',
          payload: {
            event: buildEvent(tripId, 'suggestion_selected', {
              suggestionId: suggestion.id,
              title: suggestion.title,
              category: suggestion.category,
              areaName: suggestion.areaName,
            }),
            memory: {
              id: createId('memory'),
              tripId,
              title: suggestion.title,
              summary: suggestion.reason || `Chosen while exploring ${suggestion.areaName}.`,
              imageKey: suggestion.imageKey,
              timestamp: new Date().toISOString(),
              locationLabel: suggestion.areaName,
            },
          },
        });
      },
      changeArea: (tripId, areaName) => {
        const trip = state.trips.find((item) => item.id === tripId);
        if (!trip) {
          return;
        }

        const suggestions = buildExploreSuggestions(trip, areaName);
        dispatch({
          type: 'CHANGE_AREA',
          payload: {
            tripId,
            suggestions,
            event: buildEvent(tripId, 'area_changed', {
              areaName,
            }),
          },
        });
      },
      addMemory: (tripId, payload) => {
        const memory: MemoryItem = {
          id: createId('memory'),
          tripId,
          timestamp: new Date().toISOString(),
          ...payload,
        };

        dispatch({
          type: 'ADD_MEMORY',
          payload: {
            memory,
            event: buildEvent(tripId, 'memory_added', {
              title: memory.title,
              locationLabel: memory.locationLabel,
            }),
          },
        });
      },
      generateRecap: (tripId) => {
        const recap = buildRecapForTrip(state, tripId);
        if (!recap) {
          return;
        }

        dispatch({ type: 'GENERATE_RECAP', payload: recap });
      },
      completeTrip: (tripId) => {
        const completionEvent = buildEvent(tripId, 'trip_completed', { completedAt: new Date().toISOString() });

        const nextState: AppState = {
          ...state,
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  status: 'completed',
                }
              : trip,
          ),
          eventsByTripId: {
            ...state.eventsByTripId,
            [tripId]: [...(state.eventsByTripId[tripId] ?? []), completionEvent],
          },
        };

        const recap = buildRecapForTrip(nextState, tripId);
        if (!recap) {
          return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        dispatch({
          type: 'COMPLETE_TRIP',
          payload: {
            tripId,
            recap,
            event: completionEvent,
          },
        });
      },
      resetToSeedData: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        dispatch({ type: 'RESET_TO_SEED' });
      },
    };
  }, [state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }
  return context;
};

export const getAreasForTripDestination = (destination: string): string[] => {
  return areaPresets[destination] ?? ['Central', 'Old Town', 'Waterfront', 'Arts Quarter'];
};