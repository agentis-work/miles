import React, { useState } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const Button = ({ label, onPress, variant = 'primary', style, disabled = false }: ButtonProps) => {
  const theme = useTheme();
  const isPrimary = variant === 'primary';
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      hitSlop={4}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? theme.colors.primary : 'transparent',
          borderColor: isPrimary ? theme.colors.primary : theme.colors.cardBorder,
          borderWidth: isFocused ? 2 : 1,
          shadowOpacity: isPrimary && !disabled ? (pressed ? 0.05 : 0.12) : 0,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        isFocused
          ? {
              shadowColor: theme.colors.primary,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 0 },
              elevation: 0,
            }
          : null,
        !isPrimary && styles.secondary,
        style,
      ]}
    >
      <Text style={[styles.label, { color: isPrimary ? '#FDF8EE' : theme.colors.textPrimary }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondary: {
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
});
