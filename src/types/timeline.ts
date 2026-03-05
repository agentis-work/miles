export type TimelineItemType =
  | 'flight'
  | 'lodging'
  | 'activity'
  | 'food'
  | 'transport'
  | 'note'
  | 'tip';

export type TimelineItem = {
  id: string;
  type: TimelineItemType;
  title: string;
  time?: string;
  subtitle?: string;
  detail?: string;
  locationName?: string;
  meta?: string;
};

export type TimelineDay = {
  dateISO: string;
  label: string;
  title?: string;
  items: TimelineItem[];
};

export type TripTimeline = {
  tripId: string;
  days: TimelineDay[];
};
