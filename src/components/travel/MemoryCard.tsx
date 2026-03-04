import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '../ui/Card';
import { MemoryItem } from '../../models/memory';
import { useTheme } from '../../theme/useTheme';

interface MemoryCardProps {
  memory: MemoryItem;
}

export const MemoryCard = ({ memory }: MemoryCardProps) => {
  const theme = useTheme();

  return (
    <Card>
      <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>{memory.title}</Text>
      <Text style={[styles.meta, theme.typography.caption, { color: theme.colors.textSecondary }]}> 
        {new Date(memory.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        {memory.locationLabel ? ` • ${memory.locationLabel}` : ''}
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: 6 }]}>{memory.summary}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  meta: {
    marginTop: 4,    fontWeight: '600',
  },
});
