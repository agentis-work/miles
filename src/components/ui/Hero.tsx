import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useTheme } from '../../theme/useTheme';

interface HeroProps {
  imageUri: string;
  title?: string;
  subtitle?: string;
  helperText?: string;
  height?: number;
  glow?: boolean;
  glassContent?: ReactNode;
}

export const Hero = ({ imageUri, title, subtitle, helperText, height = 240, glow = true, glassContent }: HeroProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { height }, theme.shadows.elevated]}>
      <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" transition={150} />
      {glow ? (
        <>
          <View style={[styles.glowPrimary, { backgroundColor: `${theme.colors.primary}20` }]} />
          <View style={[styles.glowAccent, { backgroundColor: `${theme.colors.accent}1E` }]} />
        </>
      ) : null}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.overlay} />
      <BlurView intensity={22} tint="light" style={styles.glass}>
        {glassContent ? (
          glassContent
        ) : (
          <>
            {title ? <Text style={[styles.title, theme.typography.h1]}>{title}</Text> : null}
            {subtitle ? <Text style={[styles.subtitle, theme.typography.bodyStrong]}>{subtitle}</Text> : null}
            {helperText ? <Text style={[styles.helper, theme.typography.caption]}>{helperText}</Text> : null}
          </>
        )}
      </BlurView>
      <LinearGradient colors={theme.gradients.ambient} style={styles.modeTint} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  glowPrimary: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -120,
    left: -60,
    zIndex: 0,
  },
  glowAccent: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
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
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    color: 'white',
  },
  subtitle: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.95)',
  },
  helper: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.85)',
  },
  modeTint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.22,
  },
});
