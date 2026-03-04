import React, { ReactNode, useMemo, useState } from 'react';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import BrandMark from '../brand/BrandMark';
import { useTheme } from '../../theme/useTheme';
import { fallbackCoverImage } from '../../assets/coverImages';

interface HeroProps {
  imageSource: ImageSourcePropType;
  title?: string;
  subtitle?: string;
  helperText?: string;
  glow?: boolean;
  glassContent?: ReactNode;
}

export const Hero = ({ imageSource, title, subtitle, helperText, glow = true, glassContent }: HeroProps) => {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const resolvedSource = useMemo(() => (failed ? fallbackCoverImage : imageSource), [failed, imageSource]);

  return (
    <View style={[styles.container, { height: theme.spacing.heroHeight, borderRadius: theme.spacing.xl }, theme.shadows.elevated]}>
      <Image source={resolvedSource} style={styles.image} contentFit="cover" transition={150} onError={() => setFailed(true)} />
      {glow ? (
        <>
          <View style={[styles.glowPrimary, { backgroundColor: `${theme.colors.primary}20`, borderRadius: theme.radii.pill }]} />
          <View style={[styles.glowAccent, { backgroundColor: `${theme.colors.accent}1E`, borderRadius: theme.radii.pill }]} />
        </>
      ) : null}
      <LinearGradient colors={[`${theme.colors.primaryStrong}00`, `${theme.colors.primaryStrong}CC`]} style={styles.overlay} />
      <View style={[styles.brandTop, { top: theme.spacing.s14, left: theme.spacing.s14 }]} pointerEvents="none">
        <View style={styles.brandGhost}>
          <BrandMark size="sm" variant="full" tone="light" />
        </View>
      </View>
      <BlurView
        intensity={22}
        tint="light"
        style={[styles.glass, { left: theme.spacing.md, right: theme.spacing.md, bottom: theme.spacing.md, borderRadius: theme.spacing.md, padding: theme.spacing.s14 }]}
      >
        {glassContent ? (
          glassContent
        ) : (
          <>
            {title ? <Text style={[styles.title, theme.typography.heroTitle, { color: theme.colors.onImagePrimary }]}>{title}</Text> : null}
            {subtitle ? <Text style={[styles.subtitle, theme.typography.heroSub, { color: theme.colors.onImageSecondary }]}>{subtitle}</Text> : null}
            {helperText ? <Text style={[styles.helper, theme.typography.heroEyebrow, { color: theme.colors.onImageTertiary }]}>{helperText}</Text> : null}
          </>
        )}
      </BlurView>
      <LinearGradient colors={theme.gradients.ambient} style={styles.modeTint} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  glowPrimary: {
    position: 'absolute',
    width: 280,
    height: 280,
    top: -120,
    left: -60,
    zIndex: 0,
  },
  glowAccent: {
    position: 'absolute',
    width: 220,
    height: 220,
    bottom: -120,
    right: -30,
    zIndex: 0,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  glass: {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  brandTop: {
    position: 'absolute',
  },
  brandGhost: {
    opacity: 0.68,
  },
  title: {
  },
  subtitle: {
    marginTop: 4,
  },
  helper: {
    marginTop: 8,
  },
  modeTint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.22,
  },
});
