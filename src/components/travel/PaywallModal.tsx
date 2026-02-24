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
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.modalWrap, cardStyle]}>
          <BlurView intensity={42} tint="light" style={[styles.card, { borderColor: `${theme.colors.accent}55` }]}>
            <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
            <Text style={[theme.typography.h2, { color: theme.colors.textPrimary }]}>Unlock unlimited trips</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Trailo membership removes the one-trip limit.</Text>

            <View style={styles.bullets}>
              <Text style={[styles.bullet, { color: theme.colors.textSecondary }]}>- Unlimited trip creation</Text>
              <Text style={[styles.bullet, { color: theme.colors.textSecondary }]}>- Priority concierge suggestions</Text>
              <Text style={[styles.bullet, { color: theme.colors.textSecondary }]}>- Deeper planning automation</Text>
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
    padding: 20,
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
    borderRadius: 24,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  bullets: {
    gap: 6,
    marginTop: 6,
  },
  bullet: {
    fontSize: 14,
  },
  actions: {
    gap: 10,
    marginTop: 12,
  },
});
