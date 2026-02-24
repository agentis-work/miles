import { PlanOption } from '../models/plan';
import { TravelPace } from '../models/trip';

export type PlanBudget = 'value' | 'comfort' | 'premium';

export interface PlanRefineFilters {
  pace: TravelPace;
  budget: PlanBudget;
  interests: string[];
}

const kyotoPlans: PlanOption[] = [
  {
    id: 'plan_kyoto_a',
    title: 'Balanced Explorer',
    summary: 'Landmark temples, local lanes, and crafted food in a steady rhythm.',
    metaChips: ['7 days', '3 areas', 'balanced pace'],
    highlights: ['Tea ceremony', 'Golden-hour gardens', 'Night alley tastings'],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Higashiyama Arrival',
        morning: ['Ginkaku-ji garden stroll', 'Philosopher\'s Path walk'],
        afternoon: ['Neighborhood lunch', 'Artisanal tea tasting'],
        evening: ['Pontocho riverside dinner', 'Lantern lane photo walk'],
      },
      {
        dayNumber: 2,
        title: 'Arashiyama Flow',
        morning: ['Bamboo grove early access', 'Riverbank coffee'],
        afternoon: ['Tenryu-ji and craft boutiques', 'Matcha dessert stop'],
        evening: ['Kaiseki experience', 'Quiet temple night viewing'],
      },
    ],
    included: {
      inclusions: ['Day-by-day route', 'Food neighborhood picks', 'Transit guidance'],
      exclusions: ['Flights', 'Hotel bookings', 'Paid attraction tickets'],
    },
    notes: ['Best in spring and autumn light.', 'Comfortable shoes recommended for alley routes.'],
  },
  {
    id: 'plan_kyoto_b',
    title: 'Relaxed Heritage',
    summary: 'Slower mornings, intimate cultural sessions, and calmer evenings.',
    metaChips: ['7 days', '2 areas', 'relaxed pace'],
    highlights: ['Private calligraphy', 'Garden tea ritual', 'Canal sunset walk'],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Temple & Tea',
        morning: ['Heian shrine grounds', 'Minimalist garden sketch break'],
        afternoon: ['Tea workshop', 'Canal-side lunch'],
        evening: ['Gion cultural district stroll', 'Chef-led local tasting'],
      },
      {
        dayNumber: 2,
        title: 'Soft Scenic Day',
        morning: ['Southern shrine gates route', 'Local pastry stop'],
        afternoon: ['Craft market browsing', 'Slow river promenade'],
        evening: ['Jazz bar reservation', 'Late-night ramen'],
      },
    ],
    included: {
      inclusions: ['Calm itinerary pacing', 'Reserved cultural sessions', 'Restaurant shortlist'],
      exclusions: ['Intercity transport', 'Insurance', 'Personal shopping'],
    },
    notes: ['Designed for low-friction days.', 'Great for couples and solo travelers.'],
  },
  {
    id: 'plan_kyoto_c',
    title: 'Packed City Pulse',
    summary: 'Dense, high-energy route for travelers who want maximum variety.',
    metaChips: ['6 days', '4 areas', 'packed pace'],
    highlights: ['Early shrine loop', 'Food crawl', 'Late-night design bars'],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Classic Core Sprint',
        morning: ['Sunrise shrine gates', 'Temple ridge viewpoints'],
        afternoon: ['Market street tasting run', 'Museum stop'],
        evening: ['Chef counter dinner', 'Craft cocktail circuit'],
      },
      {
        dayNumber: 2,
        title: 'Modern + Traditional',
        morning: ['Design district galleries', 'Specialty coffee pairing'],
        afternoon: ['Castle grounds and gardens', 'Street-snack sampling'],
        evening: ['Rooftop city views', 'Live music venue'],
      },
    ],
    included: {
      inclusions: ['High-density schedule', 'Fast transit hops', 'Night activity stack'],
      exclusions: ['Premium reservations', 'Private transport'],
    },
    notes: ['Expect 18k+ steps daily.', 'Best for energetic travel styles.'],
  },
  {
    id: 'plan_kyoto_d',
    title: 'Premium Signature',
    summary: 'Concierge-level highlights with private sessions and elevated dining.',
    metaChips: ['7 days', '3 areas', 'balanced pace'],
    highlights: ['Private tea host', 'Chef-table evening', 'Curated design atelier'],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Elevated Arrival',
        morning: ['Luxury spa welcome', 'Curated neighborhood orientation'],
        afternoon: ['Private atelier visit', 'Seasonal tasting menu preview'],
        evening: ['Chef-table dinner', 'River-lit night walk'],
      },
      {
        dayNumber: 2,
        title: 'Cultural Signature',
        morning: ['Quiet temple access window', 'Guided heritage narrative'],
        afternoon: ['Bespoke tea experience', 'Design studio shopping'],
        evening: ['Performance reservation', 'Late sake pairings'],
      },
    ],
    included: {
      inclusions: ['Premium recommendation set', 'Private-session placeholders', 'Elevated dining map'],
      exclusions: ['Actual paid bookings', 'International flights'],
    },
    notes: ['Ideal for comfort-forward trips.', 'Reservations should be confirmed early.'],
  },
];

const lisbonPlans: PlanOption[] = [
  {
    id: 'plan_lisbon_a',
    title: 'Coastal Rhythm',
    summary: 'Historic streets by day, waterfront and live music at night.',
    metaChips: ['6 days', '3 areas', 'balanced pace'],
    highlights: ['Tram viewpoints', 'Seafood lane', 'Sunset miradouros'],
    itinerary: [
      {
        dayNumber: 1,
        morning: ['Alfama walk', 'Castle lookout'],
        afternoon: ['Belem pastry route', 'Riverfront museum'],
        evening: ['Fado dinner', 'Old town stroll'],
      },
    ],
    included: {
      inclusions: ['Scenic routing', 'Food neighborhoods'],
      exclusions: ['Intercity rail', 'Hotel inclusions'],
    },
    notes: ['Comfortable shoes recommended on hills.'],
  },
  {
    id: 'plan_lisbon_b',
    title: 'Atlantic Weekend Extended',
    summary: 'Design-forward cafes, historic quarters, and coastal day trips.',
    metaChips: ['5 days', '2 areas', 'relaxed pace'],
    highlights: ['Cafe circuit', 'Beach extension', 'River ferry views'],
    itinerary: [
      {
        dayNumber: 1,
        morning: ['Cais do Sodre coffee'],
        afternoon: ['LX Factory exploration'],
        evening: ['Sunset dining near the river'],
      },
    ],
    included: {
      inclusions: ['Relaxed city map', 'Cafe shortlist'],
      exclusions: ['Private transport'],
    },
    notes: ['Great for design and food interests.'],
  },
  {
    id: 'plan_lisbon_c',
    title: 'Fast Track Lisbon',
    summary: 'Compact and energetic itinerary with tightly scheduled highlights.',
    metaChips: ['4 days', '4 areas', 'packed pace'],
    highlights: ['Night tram loop', 'Market sprint', 'Late rooftop sets'],
    itinerary: [
      {
        dayNumber: 1,
        morning: ['Bairro Alto loops'],
        afternoon: ['Market and gallery combo'],
        evening: ['Rooftop + fado double'],
      },
    ],
    included: {
      inclusions: ['Dense routing', 'Night picks'],
      exclusions: ['Guided tours'],
    },
    notes: ['Best for short, high-energy trips.'],
  },
];

const floridaPlans: PlanOption[] = [
  {
    id: 'plan_florida_a',
    title: 'Coastal Sunshine Loop',
    summary: 'A balanced Florida route across beach mornings, city culture, and sunset drives.',
    metaChips: ['7 days', '4 areas', 'balanced pace'],
    highlights: ['South Beach sunrise', 'Little Havana flavors', 'Sunset in Key West'],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Miami Arrival',
        morning: ['South Beach boardwalk stroll', 'Oceanfront breakfast'],
        afternoon: ['Wynwood art district', 'Design district shopping'],
        evening: ['Little Havana food trail', 'Live Latin music stop'],
      },
      {
        dayNumber: 2,
        title: 'Keys Day',
        morning: ['Drive toward Key Largo', 'Coastal photo viewpoints'],
        afternoon: ['Key West old town walk', 'Waterfront lunch'],
        evening: ['Mallory Square sunset', 'Casual seafood dinner'],
      },
    ],
    included: {
      inclusions: ['Beach and city balance', 'Food-forward recommendations', 'Scenic driving notes'],
      exclusions: ['Theme park tickets', 'Boat excursions'],
    },
    notes: ['Best with early starts to avoid peak heat.', 'Pack light layers for breezy evenings.'],
  },
  {
    id: 'plan_florida_b',
    title: 'Parks & Palm Days',
    summary: 'Family-ready itinerary blending Orlando park energy and relaxed coast downtime.',
    metaChips: ['6 days', '3 areas', 'packed pace'],
    highlights: ['Orlando park day', 'Resort pool reset', 'Space Coast views'],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Orlando Focus',
        morning: ['Theme park early entry', 'Priority attractions block'],
        afternoon: ['Family lunch + rides', 'Cooling indoor breaks'],
        evening: ['Night parade or show', 'Late dessert stop'],
      },
      {
        dayNumber: 2,
        title: 'Atlantic Excursion',
        morning: ['Kennedy Space area visit', 'Coastal café'],
        afternoon: ['Beach time', 'Boardwalk exploration'],
        evening: ['Drive back with sunset stop', 'Resort dinner'],
      },
    ],
    included: {
      inclusions: ['Park-day structure', 'Family pacing tips', 'Transit timing guidance'],
      exclusions: ['Fast-pass purchases', 'Premium dining add-ons'],
    },
    notes: ['Hydration and shade breaks are essential.', 'Pre-book major attractions where possible.'],
  },
  {
    id: 'plan_florida_c',
    title: 'Everglades & Culture Escape',
    summary: 'Nature-rich mornings, wildlife windows, and elevated city evenings.',
    metaChips: ['5 days', '3 areas', 'relaxed pace'],
    highlights: ['Everglades airboat route', 'Art deco nights', 'Waterfront dining'],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Nature First',
        morning: ['Everglades wetland route', 'Guided wildlife lookout'],
        afternoon: ['Eco-center exhibits', 'Slow café break'],
        evening: ['Return to Miami', 'Art deco evening walk'],
      },
      {
        dayNumber: 2,
        title: 'Culture + Coast',
        morning: ['Museum district', 'Design boutiques'],
        afternoon: ['Biscayne waterfront cruise window'],
        evening: ['Chef-led coastal dinner', 'Night skyline stop'],
      },
    ],
    included: {
      inclusions: ['Nature and city pairing', 'Relaxed timing windows', 'Dining shortlist'],
      exclusions: ['Private tours', 'Rental upgrades'],
    },
    notes: ['Wildlife visibility is best early morning.', 'Bring sun protection and light footwear.'],
  },
];

const hyderabadPlans: PlanOption[] = [
  {
    id: 'plan_hyderabad_a',
    title: 'Heritage & Biryani Trail',
    summary: 'Old City landmarks, signature food stops, and evening cultural layers.',
    metaChips: ['6 days', '4 areas', 'balanced pace'],
    highlights: ['Charminar walk', 'Laad Bazaar crafts', 'Sunset at Golconda'],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Old City Core',
        morning: ['Charminar and Mecca Masjid route', 'Street chai break'],
        afternoon: ['Laad Bazaar browsing', 'Regional lunch tasting'],
        evening: ['Salar Jung Museum wing highlights', 'Iconic biryani dinner'],
      },
      {
        dayNumber: 2,
        title: 'Fort + Lakeside',
        morning: ['Golconda Fort ramparts', 'History trail viewpoints'],
        afternoon: ['Qutb Shahi tomb complex', 'Slow coffee reset'],
        evening: ['Hussain Sagar promenade', 'Night market snacks'],
      },
    ],
    included: {
      inclusions: ['Heritage-first routing', 'Food trail recommendations', 'Transit guidance by area'],
      exclusions: ['Private guides', 'Paid event tickets'],
    },
    notes: ['Mornings are best for dense heritage zones.', 'Carry modest attire for religious sites.'],
  },
  {
    id: 'plan_hyderabad_b',
    title: 'Modern Meets Legacy',
    summary: 'A polished blend of Hitech City modernity with classic Hyderabad icons.',
    metaChips: ['5 days', '3 areas', 'balanced pace'],
    highlights: ['Hitech skyline cafes', 'Museum circuit', 'Fort sound show'],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Tech District Start',
        morning: ['Hitech City brunch circuit', 'Contemporary design spaces'],
        afternoon: ['Knowledge museums and galleries', 'Premium retail stop'],
        evening: ['Banjara Hills fine dining', 'Rooftop city view'],
      },
      {
        dayNumber: 2,
        title: 'Legacy Contrast',
        morning: ['Chowmahalla Palace highlights', 'Old city courtyard walk'],
        afternoon: ['Craft market browse', 'Slow lunch in heritage quarter'],
        evening: ['Golconda light-and-sound slot', 'Late dessert route'],
      },
    ],
    included: {
      inclusions: ['Balanced modern/heritage flow', 'Dining curation', 'Flexible afternoon windows'],
      exclusions: ['Private transport upgrades'],
    },
    notes: ['Traffic can vary sharply by time window.', 'Reserve evening events in advance.'],
  },
  {
    id: 'plan_hyderabad_c',
    title: 'Culture + Day Trips',
    summary: 'City heritage anchors with a curated day-trip rhythm and relaxed nights.',
    metaChips: ['7 days', '4 areas', 'relaxed pace'],
    highlights: ['Ramoji day window', 'Temple trail option', 'Night food walk'],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Cultural Foundations',
        morning: ['State museum collection highlights', 'Garden walk'],
        afternoon: ['Craft and textile stop', 'Traditional lunch'],
        evening: ['Banjara Hills cafe lounge', 'Street dessert tasting'],
      },
      {
        dayNumber: 2,
        title: 'Excursion Day',
        morning: ['Day-trip departure (Ramoji or heritage route)'],
        afternoon: ['Curated attraction block', 'Leisure reset'],
        evening: ['Return to city', 'Old city food lane'],
      },
    ],
    included: {
      inclusions: ['Day-trip templates', 'Cultural emphasis', 'Relaxed evening options'],
      exclusions: ['Day-trip tickets', 'Premium chauffeur options'],
    },
    notes: ['Choose day trips based on weather and traffic.', 'Keep one buffer evening for spontaneous plans.'],
  },
];

const planBankByTripId: Record<string, PlanOption[]> = {
  trip_kyoto: kyotoPlans,
  trip_lisbon: lisbonPlans,
  trip_florida: floridaPlans,
  trip_hyderabad: hyderabadPlans,
};

const rotate = <T>(array: T[], offset: number) => {
  if (!array.length) {
    return array;
  }

  const shift = ((offset % array.length) + array.length) % array.length;
  return [...array.slice(shift), ...array.slice(0, shift)];
};

const getOffset = (pace: TravelPace, budget: PlanBudget, interests: string[]) => {
  const paceScore = pace === 'relaxed' ? 0 : pace === 'balanced' ? 1 : 2;
  const budgetScore = budget === 'value' ? 0 : budget === 'comfort' ? 1 : 2;
  const interestScore = interests.length % 3;
  return paceScore + budgetScore + interestScore;
};

export const getPlanOptionsForTrip = (tripId: string): PlanOption[] => {
  const options = planBankByTripId[tripId] ?? kyotoPlans;
  return options.slice(0, 4);
};

export const getRefinedPlanOptions = (tripId: string, filters: PlanRefineFilters): PlanOption[] => {
  const options = getPlanOptionsForTrip(tripId);
  return rotate(options, getOffset(filters.pace, filters.budget, filters.interests)).slice(0, 4);
};

export const getPlanOptionById = (tripId: string, optionId: string): PlanOption | null => {
  const options = getPlanOptionsForTrip(tripId);
  return options.find((option) => option.id === optionId) ?? null;
};