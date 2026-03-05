import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TimelineItem } from '../../types/timeline';
import { useTheme } from '../../theme/useTheme';
import { IconChip } from './IconChip';

interface TimelineItemRowProps {
  item: TimelineItem;
  isFirst: boolean;
  isLast: boolean;
}

export const TimelineItemRow = ({ item, isFirst, isLast }: TimelineItemRowProps) => {
  const theme = useTheme();
  const isTip = item.type === 'tip';

  return (
    <View style={styles.row}>
      <View style={styles.railColumn}>
        {!isFirst ? <View style={[styles.railSegment, styles.railTop, { backgroundColor: theme.colors.cardBorder }]} /> : null}
        <IconChip type={item.type} />
        {!isLast ? <View style={[styles.railSegment, styles.railBottom, { backgroundColor: theme.colors.cardBorder }]} /> : null}
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: isTip ? `${theme.colors.primary}0D` : theme.colors.card,
            borderColor: isTip ? `${theme.colors.primary}36` : theme.colors.cardBorder,
          },
          theme.shadows.soft,
        ]}
      >
        <View style={styles.titleRow}>
          <Text style={[theme.typography.bodyStrong, { color: theme.colors.textPrimary, flex: 1 }]}>{item.type === 'tip' ? 'Miles Tip' : item.title}</Text>
          {item.time ? (
            <View style={[styles.timeBadge, { backgroundColor: theme.colors.surfaceMuted }]}>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>{item.time}</Text>
            </View>
          ) : null}
        </View>

        {item.subtitle ? <Text style={[styles.subtitle, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text> : null}
        {item.detail ? <Text style={[styles.detail, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>{item.detail}</Text> : null}
        {item.meta ? <Text style={[styles.meta, theme.typography.caption, { color: theme.colors.textTertiary }]}>{item.meta}</Text> : null}
        {item.locationName ? <Text style={[styles.meta, theme.typography.caption, { color: theme.colors.textTertiary }]}>{item.locationName}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  railColumn: {
    width: 30,
    alignItems: 'center',
    position: 'relative',
  },
  railSegment: {
    position: 'absolute',
    width: 1,
    left: 14.5,
  },
  railTop: {
    top: 0,
    bottom: '50%',
    marginBottom: 12,
  },
  railBottom: {
    top: '50%',
    bottom: 0,
    marginTop: 12,
  },
  card: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  subtitle: {
    marginTop: 4,
  },
  detail: {
    marginTop: 6,
  },
  meta: {
    marginTop: 6,
  },
});
