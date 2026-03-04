import React from 'react';
import { ColorSchemeName, Image, ImageSourcePropType, StyleSheet, useColorScheme, View } from 'react-native';

type MilesLogoVariant = 'full' | 'mark';
type MilesLogoTheme = 'auto' | 'light' | 'dark';

interface MilesLogoProps {
  variant?: MilesLogoVariant;
  width: number;
  theme?: MilesLogoTheme;
  accessibilityLabel?: string;
}

// Derived from generated PNG metadata in assets/brand/png:
// full: ~3.8, mark: 1
const ASPECT_RATIO: Record<MilesLogoVariant, number> = {
  full: 3.8,
  mark: 1,
};

const lightAssets: Record<MilesLogoVariant, ImageSourcePropType> = {
  full: require('../../../assets/brand/png/miles-logo.png'),
  mark: require('../../../assets/brand/png/miles-mark.png'),
};

const darkAssets: Partial<Record<MilesLogoVariant, ImageSourcePropType>> = {
  full: require('../../../assets/brand/png/miles-logo-dark.png'),
  mark: require('../../../assets/brand/png/miles-mark-dark.png'),
};

const resolveUseDark = (theme: MilesLogoTheme, scheme: ColorSchemeName) => {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return scheme === 'dark';
};

const MilesLogo = ({ variant = 'full', width, theme = 'auto', accessibilityLabel = 'Miles logo' }: MilesLogoProps) => {
  const scheme = useColorScheme();
  const useDarkAsset = resolveUseDark(theme, scheme);
  const source = useDarkAsset ? darkAssets[variant] ?? lightAssets[variant] : lightAssets[variant];

  return (
    <View style={styles.container} accessibilityRole="image" accessible accessibilityLabel={accessibilityLabel}>
      <Image source={source} resizeMode="contain" style={{ width, aspectRatio: ASPECT_RATIO[variant] }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default MilesLogo;
