import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Button } from '../ui/Button';
import { useTheme } from '../../theme/useTheme';
import { useReducedMotion } from '../../utils/useReducedMotion';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onEnableMembership: () => void;
}

export const PaywallModal = ({ visible, onClose, onEnableMembership }: PaywallModalProps) => {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: reducedMotion ? 0 : visible ? 220 : 180,
      useNativeDriver: true,
    }).start();
  }, [visible, progress, reducedMotion]);

  const cardStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [22, 0],
          }),
        },
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.98, 1],
          }),
        },
      ],
      opacity: progress,
    }),
    [progress],
  );

  const onEnable = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onEnableMembership();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={[styles.root, { padding: theme.spacing.lg }]}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.modalWrap, cardStyle]}>
          <BlurView
            intensity={42}
            tint="light"
            style={[styles.card, { borderColor: `${theme.colors.accent}55`, borderRadius: theme.spacing.xl, padding: theme.spacing.lg, gap: theme.spacing.s10 }]}
          >
            <View style={[styles.dot, { backgroundColor: theme.colors.accent, borderRadius: theme.spacing.xxs }]} />
            <Text style={[theme.typography.h2, { color: theme.colors.textPrimary }]}>Unlock unlimited trips</Text>
            <Text style={[styles.subtitle, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>Miles membership removes the one-trip limit.</Text>

            <View style={styles.bullets}>
              <Text style={[styles.bullet, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>- Unlimited trip creation</Text>
              <Text style={[styles.bullet, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>- Priority concierge suggestions</Text>
              <Text style={[styles.bullet, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>- Deeper planning automation</Text>
            </View>

            <View style={styles.actions}>
              <Button label="Enable Membership" onPress={onEnable} />
              <Button label="Not now" variant="secondary" onPress={onClose} />
            </View>
          </BlurView>
        </Animated.View>
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
    backgroundColor: 'rgba(14,14,14,0.4)',
  },
  modalWrap: {
    width: '100%',
  },
  card: {
    width: '100%',
    borderWidth: 1,
    overflow: 'hidden',
  },
  dot: {
    width: 8,
    height: 8,
  },
  subtitle: {
  },
  bullets: {
    gap: 6,
    marginTop: 6,
  },
  bullet: {
  },
  actions: {
    gap: 10,
    marginTop: 12,
  },
});
