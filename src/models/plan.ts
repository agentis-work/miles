export interface PlanItineraryDay {
  dayNumber: number;
  title?: string;
  morning: string[];
  afternoon: string[];
  evening: string[];
}

export interface PlanOption {
  id: string;
  title: string;
  summary: string;
  metaChips: string[];
  highlights: string[];
  itinerary: PlanItineraryDay[];
  included?: {
    inclusions: string[];
    exclusions: string[];
  };
  notes?: string[];
}