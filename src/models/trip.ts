export type TripStatus = 'planning' | 'preparing' | 'active' | 'completed';

export type TravelersType = 'solo' | 'couple' | 'family' | 'group';

export type TravelPace = 'relaxed' | 'balanced' | 'packed';

export interface Trip {
  id: string;
  destination: string;
  country: string;
  dateStart: string;
  dateEnd: string;
  travelersType: TravelersType;
  pace: TravelPace;
  interests: string[];
  status: TripStatus;
  coverImageKey: string;
  selectedOptionId?: string;
  createdAt: string;
}