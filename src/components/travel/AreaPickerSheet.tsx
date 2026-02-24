import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Button } from '../ui/Button';
import { useTheme } from '../../theme/useTheme';

interface AreaPickerSheetProps {
  visible: boolean;
  areas: string[];
  selectedArea?: string;
  onSelect: (area: string) => void;
  onClose: () => void;
}

export const AreaPickerSheet = ({ visible, areas, selectedArea, onSelect, onClose }: AreaPickerSheetProps) => {
  const theme = useTheme();
  const uniqueAreas = useMemo(() => Array.from(new Set(areas)), [areas]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <BlurView intensity={34} tint="light" style={[styles.sheet, { borderColor: theme.colors.cardBorder }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Choose area</Text>
          <View style={styles.list}>
            {uniqueAreas.map((area) => (
              <Button
                key={area}
                label={area}
                variant={selectedArea === area ? 'primary' : 'secondary'}
                onPress={() => {
                  onSelect(area);
                  onClose();
                }}
              />
            ))}
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.3)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
  },
  list: {
    marginTop: 12,
    gap: 8,
  },
});