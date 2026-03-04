import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ExploreSuggestion } from '../../models/explore';
import { useTheme } from '../../theme/useTheme';
import { imageByKey } from '../../mock/images';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface SuggestionCardProps {
  suggestion: ExploreSuggestion;
  onGuide: () => void;
  onSave: () => void;
  onSwap?: () => void;
}

export const SuggestionCard = ({ suggestion, onGuide, onSave, onSwap }: SuggestionCardProps) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Image source={imageByKey[suggestion.imageKey] ?? imageByKey.default} style={styles.image} contentFit="cover" transition={120} />
      <View style={styles.content}>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>{suggestion.title}</Text>
        <Text style={[styles.distance, theme.typography.bodyStrongSmall, { color: theme.colors.textSecondary }]}>{suggestion.distanceLabel}</Text>
        <Text style={[styles.reason, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>Why now: {suggestion.reason}</Text>

        <View style={styles.actions}>
          <Button label="Guide me" onPress={onGuide} style={styles.primary} />
          <Button label="Save" variant="secondary" onPress={onSave} style={styles.secondary} />
          {onSwap ? <Button label="Swap" variant="secondary" onPress={onSwap} style={styles.secondary} /> : null}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 130,
  },
  content: {
    padding: 14,
    gap: 6,
  },
  distance: {    fontWeight: '600',
  },
  reason: {    lineHeight: 20,
  },
  actions: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  primary: {
    minWidth: 116,
  },
  secondary: {
    minWidth: 92,
  },
});

