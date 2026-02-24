export type TripEventType =
  | 'area_changed'
  | 'suggestion_viewed'
  | 'suggestion_saved'
  | 'suggestion_selected'
  | 'memory_added'
  | 'trip_completed';

export interface TripEvent {
  id: string;
  tripId: string;
  type: TripEventType;
  createdAt: string;
  payload: Record<string, any>;
}