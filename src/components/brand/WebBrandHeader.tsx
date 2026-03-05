import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MilesLogo from './MilesLogo';
import { useTheme } from '../../theme/useTheme';

export const WebBrandHeader = () => {
  const theme = useTheme();

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.cardBorder, backgroundColor: theme.colors.background }]}>
      <MilesLogo variant="full" width={320} accessibilityLabel="Miles" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
});
