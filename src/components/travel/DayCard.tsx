import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { PlanItineraryDay } from '../../models/plan';
import { useTheme } from '../../theme/useTheme';
import { Card } from '../ui/Card';

interface DayCardProps {
  day: PlanItineraryDay;
  imageUri?: string;
}

const Section = ({ title, items }: { title: string; items: string[] }) => {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
      {items.slice(0, 3).map((item) => (
        <Text key={item} style={[styles.item, { color: theme.colors.textSecondary }]}> 
          - {item}
        </Text>
      ))}
    </View>
  );
};

export const DayCard = ({ day, imageUri }: DayCardProps) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.strip} contentFit="cover" transition={120} /> : null}
      <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Day {day.dayNumber}{day.title ? ` - ${day.title}` : ''}</Text>
      <Section title="Morning" items={day.morning} />
      <Section title="Afternoon" items={day.afternoon} />
      <Section title="Evening" items={day.evening} />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 10,
    overflow: 'hidden',
    paddingTop: 0,
  },
  strip: {
    height: 56,
    marginHorizontal: -16,
    marginBottom: 8,
    opacity: 0.85,
  },
  section: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  item: {
    fontSize: 13,
    lineHeight: 18,
  },
});