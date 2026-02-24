import { ThemeColors } from './colors';
import { TripStatus } from '../models/trip';

type Overlay = {
  colors: Partial<ThemeColors>;
  gradient: [string, string];
};

export const modeOverlays: Record<TripStatus, Overlay> = {
  planning: {
    colors: {
      background: '#F6F0E4',
      tintStart: '#F6F0E4',
      tintEnd: '#EBDDC3',
      primary: '#2D6658',
      accent: '#B9965A',
    },
    gradient: ['#F9F2E8', '#EBDDC3'],
  },
  preparing: {
    colors: {
      background: '#F3F1E8',
      tintStart: '#F3F1E8',
      tintEnd: '#E3ECE2',
      primary: '#1F6A57',
      accent: '#B7A06D',
    },
    gradient: ['#F7F3EA', '#E3ECE2'],
  },
  active: {
    colors: {
      background: '#EAF2F0',
      tintStart: '#EAF2F0',
      tintEnd: '#D4E5E0',
      primary: '#165A4C',
      primaryStrong: '#0F4438',
      accent: '#B69A63',
    },
    gradient: ['#EFF6F4', '#D4E5E0'],
  },
  completed: {
    colors: {
      background: '#F5EDEC',
      tintStart: '#F5EDEC',
      tintEnd: '#EEDFE0',
      primary: '#665A69',
      primaryStrong: '#534756',
      accent: '#BF8673',
      textSecondary: '#655A5F',
    },
    gradient: ['#F9F0F0', '#EEDFE0'],
  },
};
