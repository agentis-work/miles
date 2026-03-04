import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionHeader = ({ title, actionLabel, onActionPress }: SectionHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.row, { marginBottom: theme.spacing.s10 }]}>
      <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]} accessibilityRole="header">
        {title}
      </Text>
      {actionLabel ? (
        <Pressable onPress={onActionPress} accessibilityRole="button">
          <Text style={[styles.action, theme.typography.bodySmall, { color: theme.colors.primary }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  action: {
    fontWeight: '600',
  },
});
