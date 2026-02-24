import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
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
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.cardBorder }]} accessible>
      <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description}</Text>
      {actionLabel && onActionPress ? <Button label={actionLabel} onPress={onActionPress} variant="secondary" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    gap: 13,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
});
