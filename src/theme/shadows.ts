import { ViewStyle } from 'react-native';

export const shadows: Record<'soft' | 'elevated', ViewStyle> = {
  soft: {
    shadowColor: '#0F1815',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  elevated: {
    shadowColor: '#0F1815',
    shadowOpacity: 0.11,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
};
