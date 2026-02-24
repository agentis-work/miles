import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export const Divider = () => {
  const theme = useTheme();
  return <View style={[styles.divider, { backgroundColor: `${theme.colors.cardBorder}B0` }]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
