import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TimelineDay } from '../../types/timeline';
import { useTheme } from '../../theme/useTheme';
import { TimelineItemRow } from './TimelineItemRow';

interface DaySectionProps {
  day: TimelineDay;
  dayDateLabel: string;
  isToday: boolean;
}

export const DaySection = ({ day, dayDateLabel, isToday }: DaySectionProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          borderColor: isToday ? `${theme.colors.primary}55` : 'transparent',
          backgroundColor: isToday ? `${theme.colors.primary}08` : 'transparent',
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[theme.typography.overline, { color: theme.colors.textSecondary }]}>{`${day.label.toUpperCase()} · ${dayDateLabel}`}</Text>
        {isToday ? (
          <View style={[styles.todayChip, { backgroundColor: `${theme.colors.primary}1C`, borderColor: `${theme.colors.primary}4D` }]}>
            <Text style={[theme.typography.caption, { color: theme.colors.primaryStrong }]}>TODAY</Text>
          </View>
        ) : null}
      </View>

      {day.title ? <Text style={[styles.dayTitle, theme.typography.h3, { color: theme.colors.textPrimary }]}>{day.title}</Text> : null}

      <View style={styles.itemsWrap}>
        {day.items.map((item, index) => (
          <TimelineItemRow
            key={item.id}
            item={item}
            isFirst={index === 0}
            isLast={index === day.items.length - 1}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  todayChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dayTitle: {
    marginTop: 4,
    marginBottom: 8,
  },
  itemsWrap: {
    marginTop: 2,
  },
});
