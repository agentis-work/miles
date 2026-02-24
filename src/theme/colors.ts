import { TripStatus } from '../models/trip';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceMuted: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryStrong: string;
  accent: string;
  tintStart: string;
  tintEnd: string;
  tabBar: string;
  focusRing: string;
  danger: string;
}

export const baseColors: ThemeColors = {
  background: '#F7F2E9',
  surface: '#FDF9F2',
  surfaceMuted: '#F1EBE1',
  card: '#FCF7EE',
  cardBorder: '#DDD4C6',
  textPrimary: '#1D2724',
  textSecondary: '#4E5C57',
  textTertiary: '#75827C',
  primary: '#1F5F50',
  primaryStrong: '#17483D',
  accent: '#B99A61',
  tintStart: '#F7F2E9',
  tintEnd: '#EEE6D8',
  tabBar: '#FBF6EE',
  focusRing: '#1F5F5066',
  danger: '#B84B4B',
};

export const statusTitleByMode: Record<TripStatus, string> = {
  planning: 'Planning Mode',
  preparing: 'Preparing Mode',
  active: 'Active Mode',
  completed: 'Completed Mode',
};
