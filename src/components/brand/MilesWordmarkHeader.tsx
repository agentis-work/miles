import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';

interface MilesWordmarkHeaderProps {
  rightSlot?: React.ReactNode;
  showDivider?: boolean;
}

const headerWordmark = require('../../../assets/brand/png/miles-logo-header.png');

export const MilesWordmarkHeader = ({ rightSlot, showDivider = true }: MilesWordmarkHeaderProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <View style={styles.row}>
        <View style={styles.centerWrap}>
          <Image source={headerWordmark} style={styles.logo} />
        </View>
        <View style={styles.rightSlot}>{rightSlot}</View>
      </View>
      {showDivider ? <View style={[styles.divider, { backgroundColor: theme.colors.cardBorder }]} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingBottom: 10,
  },
  row: {
    minHeight: 54,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  centerWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logo: {
    height: 34,
    width: 140,
    resizeMode: 'contain',
  },
  rightSlot: {
    marginLeft: 'auto',
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    opacity: 0.6,
  },
});
