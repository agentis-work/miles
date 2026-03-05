import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MilesLogo from './MilesLogo';
import { useTheme } from '../../theme/useTheme';

interface MilesHeaderProps {
  rightSlot?: React.ReactNode;
  showDivider?: boolean;
}

export const MilesHeader = ({ rightSlot, showDivider = true }: MilesHeaderProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <View style={styles.row}>
        <View style={styles.brandWrap}>
          <MilesLogo variant="mark" width={26} accessibilityLabel="Miles" />
          <Text style={[styles.brandText, { color: theme.colors.textPrimary }]}>Miles</Text>
        </View>
        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
      </View>
      {showDivider ? <View style={[styles.divider, { backgroundColor: theme.colors.cardBorder }]} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  row: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandText: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  rightSlot: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    opacity: 0.6,
  },
});
