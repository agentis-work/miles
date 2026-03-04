import React, { useState } from 'react';
import { Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Recap } from '../../models/recap';
import { Button } from '../ui/Button';
import { useTheme } from '../../theme/useTheme';

interface ShareRecapModalProps {
  visible: boolean;
  recap: Recap;
  onClose: () => void;
}

type Variant = 'short' | 'medium' | 'long';

export const ShareRecapModal = ({ visible, recap, onClose }: ShareRecapModalProps) => {
  const theme = useTheme();
  const [variant, setVariant] = useState<Variant>('short');

  const onShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Share.share({
      message: recap.story[variant],
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.root, { padding: theme.spacing.lg }]}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <BlurView intensity={40} tint="light" style={[styles.card, { borderColor: theme.colors.cardBorder, borderRadius: theme.spacing.xl, padding: theme.spacing.md, gap: theme.spacing.sm }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Share recap</Text>

          <View style={styles.tabs}>
            {(['short', 'medium', 'long'] as Variant[]).map((item) => (
              <Button
                key={item}
                label={item[0].toUpperCase() + item.slice(1)}
                variant={variant === item ? 'primary' : 'secondary'}
                onPress={() => setVariant(item)}
                style={styles.tabButton}
              />
            ))}
          </View>

          <Text style={[styles.story, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>{recap.story[variant]}</Text>

          <View style={styles.actions}>
            <Button label="Share" onPress={onShare} />
            <Button label="Close" variant="secondary" onPress={onClose} />
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12,12,12,0.35)',
  },
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    minWidth: 88,
  },
  story: {
  },
  actions: {
    gap: 8,
  },
});
