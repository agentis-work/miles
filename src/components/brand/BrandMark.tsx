import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import MilesLogo from './MilesLogo';

type BrandSizePreset = 'sm' | 'md' | 'lg';
type BrandVariant = 'full' | 'mark';
type BrandTone = 'auto' | 'light' | 'dark';

interface BrandMarkProps {
  size?: number | BrandSizePreset;
  variant?: BrandVariant;
  tone?: BrandTone;
  style?: StyleProp<ViewStyle>;
}

const sizeByPreset: Record<BrandSizePreset, number> = {
  sm: 24,
  md: 32,
  lg: 36,
};

const aspectByVariant: Record<BrandVariant, number> = {
  full: 980 / 260,
  mark: 240 / 120,
};

const resolveHeight = (size: number | BrandSizePreset | undefined) => {
  if (typeof size === 'number') {
    return size;
  }
  return sizeByPreset[size ?? 'md'];
};

const toneToTheme = (tone: BrandTone): 'auto' | 'light' | 'dark' => {
  if (tone === 'light') return 'dark';
  if (tone === 'dark') return 'light';
  return 'auto';
};

const BrandMark = ({ size = 'md', variant = 'full', tone = 'auto', style }: BrandMarkProps) => {
  const height = resolveHeight(size);
  const width = Math.round(height * aspectByVariant[variant]);

  return (
    <View style={style}>
      <MilesLogo variant={variant} width={width} theme={toneToTheme(tone)} accessibilityLabel="Miles brand mark" />
    </View>
  );
};

export default BrandMark;
