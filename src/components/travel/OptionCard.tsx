import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PlanOption } from '../../models/plan';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';

interface OptionCardProps {
  option: PlanOption;
  selected?: boolean;
  onPress: () => void;
  onReview: () => void;
}

export const OptionCard = ({ option, selected = false, onPress, onReview }: OptionCardProps) => {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress}>
      <Card
        style={[
          styles.card,
          selected
            ? {
                borderColor: theme.colors.primary,
                shadowColor: theme.colors.primary,
                shadowOpacity: 0.2,
              }
            : null,
        ]}
      >
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>{option.title}</Text>
        <Text numberOfLines={2} style={[styles.summary, { color: theme.colors.textSecondary }]}> 
          {option.summary}
        </Text>

        <View style={styles.chipsRow}>
          {option.metaChips.slice(0, 3).map((chip) => (
            <Chip key={chip} label={chip} selected={selected} />
          ))}
        </View>

        <View style={styles.highlightsWrap}>
          {option.highlights.slice(0, 4).map((item) => (
            <Text key={item} style={[styles.highlight, { color: theme.colors.textSecondary }]}> 
              • {item}
            </Text>
          ))}
        </View>

        <Button label="Review plan" onPress={onReview} />
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightsWrap: {
    gap: 5,
  },
  highlight: {
    fontSize: 13,
    lineHeight: 18,
  },
});
