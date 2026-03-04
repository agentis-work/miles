import React from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import MilesLogo from './MilesLogo';
import { useTheme } from '../../theme/useTheme';

export const WebBrandHeader = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') {
    return null;
  }

  const isDesktop = width >= 768;

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.cardBorder, backgroundColor: theme.colors.background }]}>
      <MilesLogo variant={isDesktop ? 'full' : 'mark'} width={isDesktop ? 132 : 18} accessibilityLabel="Miles" />
      <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Miles - Your AI travel guide.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
});
