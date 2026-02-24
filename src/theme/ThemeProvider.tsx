import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { TripStatus } from '../models/trip';
import { baseColors, ThemeColors } from './colors';
import { modeOverlays } from './modeOverlays';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { typography } from './typography';
import { radii } from './radii';

export interface AppTheme {
  mode: TripStatus;
  colors: ThemeColors;
  spacing: typeof spacing;
  shadows: typeof shadows;
  typography: typeof typography;
  radii: typeof radii;
  gradients: {
    ambient: [string, string];
    hero: [string, string];
  };
}

const ThemeContext = createContext<AppTheme | null>(null);

interface ThemeProviderProps extends PropsWithChildren {
  currentMode: TripStatus;
}

export const ThemeProvider = ({ currentMode, children }: ThemeProviderProps) => {
  const value = useMemo<AppTheme>(() => {
    const overlay = modeOverlays[currentMode];
    const colors = { ...baseColors, ...overlay.colors };

    return {
      mode: currentMode,
      colors,
      spacing,
      shadows,
      typography,
      radii,
      gradients: {
        ambient: overlay.gradient,
        hero: [colors.primaryStrong, colors.primary],
      },
    };
  }, [currentMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
