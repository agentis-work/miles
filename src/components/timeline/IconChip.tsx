import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TimelineItemType } from '../../types/timeline';
import { useTheme } from '../../theme/useTheme';

const iconByType: Record<TimelineItemType, string> = {
  flight: '??',
  lodging: '??',
  activity: '??',
  food: '???',
  transport: '??',
  note: '??',
  tip: '??',
};

interface IconChipProps {
  type: TimelineItemType;
}

export const IconChip = ({ type }: IconChipProps) => {
  const theme = useTheme();
  const isTip = type === 'tip';

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: isTip ? `${theme.colors.accent}26` : theme.colors.surface,
          borderColor: isTip ? `${theme.colors.accent}66` : theme.colors.cardBorder,
        },
      ]}
    >
      <Text style={styles.icon}>{iconByType[type]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  icon: {
    fontSize: 12,
    lineHeight: 13,
  },
});
