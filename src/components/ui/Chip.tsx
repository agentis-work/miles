import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export const Chip = ({ label, selected = false, onPress }: ChipProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.surfaceMuted,
          borderColor: selected ? theme.colors.primary : isFocused ? theme.colors.focusRing : 'transparent',
          borderRadius: theme.spacing.sm,
          paddingHorizontal: theme.spacing.s10 + 1,
          paddingVertical: theme.spacing.xs - 2,
        },
      ]}
    >
      <Text style={[styles.label, theme.typography.caption, { color: selected ? theme.colors.onPrimary : theme.colors.textSecondary }]}>{label}</Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      accessibilityRole="button"
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  label: {
    letterSpacing: 0.1,
  },
});
