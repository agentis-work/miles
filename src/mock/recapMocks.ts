import { PlanOption } from '../models/plan';
import { Recap } from '../models/recap';
import { Trip } from '../models/trip';
import { MemoryItem } from '../models/memory';
import { TripEvent } from '../models/events';

const destinationMood: Record<string, string> = {
  Kyoto: 'quiet heritage and design-forward moments',
  Lisbon: 'coastal rhythm and historic neighborhoods',
  Copenhagen: 'calm urban style and waterfront energy',
  Marrakech: 'market color and warm evening atmosphere',
  Florida: 'sun-soaked coasts, parks, and tropical pace',
  Hyderabad: 'old-city heritage, bold food, and modern skyline contrast',
};

const getDays = (start: string, end: string) => {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs < startMs) {
    return 1;
  }
  return Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);
};

const unique = (values: string[]) => Array.from(new Set(values));

const topCategoriesFromEvents = (events: TripEvent[]) => {
  const counts: Record<string, number> = {};
  events.forEach((event) => {
    const category = typeof event.payload?.category === 'string' ? event.payload.category : null;
    if (category) {
      counts[category] = (counts[category] ?? 0) + 1;
    }
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);
};

export const buildRecap = ({
  trip,
  memories,
  events,
  selectedPlan,
}: {
  trip: Trip;
  memories: MemoryItem[];
  events: TripEvent[];
  selectedPlan: PlanOption | null;
}): Recap => {
  const days = getDays(trip.dateStart, trip.dateEnd);
  const areasVisited = unique(
    events
      .filter((event) => event.type === 'area_changed')
      .map((event) => String(event.payload?.areaName ?? ''))
      .filter(Boolean),
  );
  const categories = topCategoriesFromEvents(events);
  const mood = destinationMood[trip.destination] ?? 'curated local discoveries';

  const highlightBase = [
    `Explored ${areasVisited.length || 1} neighborhood${areasVisited.length === 1 ? '' : 's'}`,
    `${memories.length} moment${memories.length === 1 ? '' : 's'} captured`,
    selectedPlan ? `Followed the ${selectedPlan.title} framework` : 'Stayed flexible day to day',
    `Focused on ${trip.interests.slice(0, 2).join(' and ') || 'local discoveries'}`,
    categories[0] ? `Top category: ${categories[0]}` : 'Balanced set of experiences',
    `Travel tone: ${mood}`,
  ];

  const summary = `Your ${trip.destination} recap highlights ${mood}, shaped by a ${trip.pace} pace and ${trip.interests.slice(0, 2).join(', ') || 'curated experiences'}.`;

  const short = `Recap: ${trip.destination} in ${days} day${days === 1 ? '' : 's'} - ${memories.length} moments, ${areasVisited.length || 1} areas explored.`;
  const medium = `${short} Highlights included ${highlightBase.slice(0, 3).join(', ').toLowerCase()}.`;
  const long = `${medium} The trip closed with a refined flow between planned anchors and spontaneous discoveries, creating a premium recap ready to share.`;

  return {
    tripId: trip.id,
    generatedAt: new Date().toISOString(),
    summary,
    highlights: highlightBase.slice(0, 6),
    story: {
      short,
      medium,
      long,
    },
    stats: {
      days,
      areasVisited: areasVisited.length ? areasVisited : [trip.destination],
      topCategories: categories.length ? categories : ['culture'],
      memoriesCount: memories.length,
    },
  };
};