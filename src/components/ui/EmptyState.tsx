import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import BrandMark from '../brand/BrandMark';
import { useTheme } from '../../theme/useTheme';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const EmptyState = ({ title, description, actionLabel, onActionPress }: EmptyStateProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.cardBorder,
          borderRadius: theme.spacing.s22,
          padding: theme.spacing.lg,
          gap: theme.spacing.s14 - 1,
        },
      ]}
      accessible
    >
      <View style={[styles.brandMarkWrap, { marginBottom: theme.spacing.xxs - 2 }]}>
        <BrandMark size="md" variant="mark" tone="dark" />
      </View>
      <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.description, theme.typography.button, { color: theme.colors.textSecondary }]}>{description}</Text>
      {actionLabel && onActionPress ? <Button label={actionLabel} onPress={onActionPress} variant="secondary" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  description: {
    lineHeight: 22,
  },
  brandMarkWrap: {},
});
