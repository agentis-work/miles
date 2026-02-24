export type SuggestionCategory = 'food' | 'culture' | 'nature' | 'nightlife' | 'shopping';

export interface ExploreSuggestion {
  id: string;
  tripId: string;
  areaName: string;
  category: SuggestionCategory;
  title: string;
  reason: string;
  distanceLabel: string;
  imageKey: string;
}