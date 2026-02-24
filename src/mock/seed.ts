import { Booking } from '../models/booking';
import { ExploreSuggestion } from '../models/explore';
import { MemoryItem } from '../models/memory';
import { MembershipState } from '../models/membership';
import { Trip } from '../models/trip';
import { TripEvent } from '../models/events';
import { Recap } from '../models/recap';

export interface SeedData {
  trips: Trip[];
  selectedTripId: string;
  bookings: Booking[];
  memories: MemoryItem[];
  exploreSuggestions: ExploreSuggestion[];
  membershipState: MembershipState;
  eventsByTripId: Record<string, TripEvent[]>;
  recapsByTripId: Record<string, Recap>;
}

const nowIso = new Date().toISOString();

export const seedData: SeedData = {
  trips: [
    {
      id: 'trip_kyoto',
      destination: 'Kyoto',
      country: 'Japan',
      dateStart: '2026-04-05',
      dateEnd: '2026-04-12',
      travelersType: 'couple',
      pace: 'balanced',
      interests: ['temples', 'design', 'food'],
      status: 'planning',
      coverImageKey: 'kyoto',
      selectedOptionId: 'plan_kyoto_a',
      createdAt: nowIso,
    },
    {
      id: 'trip_lisbon',
      destination: 'Lisbon',
      country: 'Portugal',
      dateStart: '2026-03-10',
      dateEnd: '2026-03-16',
      travelersType: 'group',
      pace: 'packed',
      interests: ['nightlife', 'seafood', 'history'],
      status: 'preparing',
      coverImageKey: 'lisbon',
      selectedOptionId: 'plan_lisbon_a',
      createdAt: nowIso,
    },
    {
      id: 'trip_copenhagen',
      destination: 'Copenhagen',
      country: 'Denmark',
      dateStart: '2026-02-25',
      dateEnd: '2026-03-02',
      travelersType: 'solo',
      pace: 'relaxed',
      interests: ['cafes', 'architecture'],
      status: 'active',
      coverImageKey: 'copenhagen',
      createdAt: nowIso,
    },
    {
      id: 'trip_marrakech',
      destination: 'Marrakech',
      country: 'Morocco',
      dateStart: '2025-11-10',
      dateEnd: '2025-11-17',
      travelersType: 'family',
      pace: 'balanced',
      interests: ['markets', 'gardens', 'crafts'],
      status: 'completed',
      coverImageKey: 'marrakech',
      createdAt: nowIso,
    },
    {
      id: 'trip_florida',
      destination: 'Florida',
      country: 'USA',
      dateStart: '2026-05-08',
      dateEnd: '2026-05-15',
      travelersType: 'family',
      pace: 'balanced',
      interests: ['beaches', 'theme parks', 'nature'],
      status: 'planning',
      coverImageKey: 'florida_cover',
      selectedOptionId: 'plan_florida_a',
      createdAt: nowIso,
    },
    {
      id: 'trip_hyderabad',
      destination: 'Hyderabad',
      country: 'India',
      dateStart: '2026-02-26',
      dateEnd: '2026-03-03',
      travelersType: 'group',
      pace: 'balanced',
      interests: ['heritage', 'food', 'technology'],
      status: 'active',
      coverImageKey: 'hyderabad_cover',
      createdAt: nowIso,
    },
  ],
  selectedTripId: 'trip_kyoto',
  bookings: [
    {
      id: 'booking_1',
      tripId: 'trip_lisbon',
      type: 'flight',
      title: 'Outbound Flight',
      subtitle: 'SFO -> LIS',
      dateTime: '2026-03-10T09:30:00.000Z',
      metadata: { airline: 'Sky Atlantic', ref: 'TC-87422' },
    },
    {
      id: 'booking_2',
      tripId: 'trip_copenhagen',
      type: 'stay',
      title: 'Canal Side Hotel',
      subtitle: '4 nights confirmed',
      metadata: { district: 'Indre By' },
    },
    {
      id: 'booking_3',
      tripId: 'trip_hyderabad',
      type: 'stay',
      title: 'Banjara Hills Hotel',
      subtitle: '5 nights reserved',
      metadata: { district: 'Banjara Hills' },
    },
  ],
  memories: [
    {
      id: 'memory_1',
      tripId: 'trip_marrakech',
      title: 'Sunset over Medina',
      timestamp: '2025-11-13T18:12:00.000Z',
      summary: 'Warm rooftop light and call to prayer in the distance.',
      imageKey: 'marrakech',
      locationLabel: 'Jemaa el-Fnaa',
    },
  ],
  exploreSuggestions: [
    {
      id: 'explore_1',
      tripId: 'trip_hyderabad',
      areaName: 'Charminar',
      category: 'culture',
      title: 'Old City heritage walk',
      reason: 'Golden-hour lanes are ideal for architecture and street photos.',
      distanceLabel: '10 min walk',
      imageKey: 'hyderabad_cover',
    },
    {
      id: 'explore_2',
      tripId: 'trip_hyderabad',
      areaName: 'Banjara Hills',
      category: 'food',
      title: 'Hyderabadi tasting route',
      reason: 'Top-rated kitchens for biryani and regional sweets nearby.',
      distanceLabel: '14 min drive',
      imageKey: 'hyderabad_cover',
    },
    {
      id: 'explore_3',
      tripId: 'trip_hyderabad',
      areaName: 'Hitech City',
      category: 'shopping',
      title: 'Modern design district loop',
      reason: 'Blends contemporary galleries with premium retail stops.',
      distanceLabel: '16 min drive',
      imageKey: 'hyderabad_cover',
    },
    {
      id: 'explore_4',
      tripId: 'trip_hyderabad',
      areaName: 'Golconda',
      category: 'nature',
      title: 'Fort and sunset viewpoint',
      reason: 'Late afternoon offers the best light and cooler climb.',
      distanceLabel: '22 min drive',
      imageKey: 'hyderabad_cover',
    },
  ],
  membershipState: {
    hasMembership: false,
    userCreatedTripCount: 0,
  },
  eventsByTripId: {},
  recapsByTripId: {},
};