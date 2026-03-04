import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface InlineHeaderProps {
  title?: string;
  onBackPress?: () => void;
}

export const InlineHeader = ({ title, onBackPress }: InlineHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {onBackPress ? (
        <Pressable onPress={onBackPress} accessibilityRole="button" style={styles.backButton}>
          <Text style={[theme.typography.button, { color: theme.colors.textPrimary }]}>{'< Back'}</Text>
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <Text style={[theme.typography.h2, { color: theme.colors.textPrimary }]}>{title ?? ''}</Text>
      <View style={styles.backPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 6,
  },
  backButton: {
    minWidth: 66,
  },
  backPlaceholder: {
    minWidth: 66,
  },
});
