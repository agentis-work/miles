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
        },
      ]}
    >
      <Text style={[styles.label, { color: selected ? '#FDF8EE' : theme.colors.textSecondary }]}>{label}</Text>
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
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
