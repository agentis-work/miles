import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OptionCard } from '../components/travel/OptionCard';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { Hero } from '../components/ui/Hero';
import { imageByKey } from '../mock/images';
import { getPlanOptionsForTrip, getRefinedPlanOptions, PlanBudget } from '../mock/aiMocks';
import { PlanOption } from '../models/plan';
import { TravelPace } from '../models/trip';
import { useAppStore } from '../state/AppStore';
import { useTheme } from '../theme/useTheme';
import { formatDateRange } from '../utils/date';

type RefineState = {
  pace: TravelPace;
  budget: PlanBudget;
  interests: string[];
};

interface PlanOptionsProps {
  tripId?: string;
  route?: { params?: { tripId?: string } };
}

const interestOptions = ['food', 'architecture', 'nature', 'history', 'design', 'nightlife', 'wellness', 'markets'];

const AnimatedOptionCard = ({
  option,
  selected,
  onPress,
  onReview,
  index,
}: {
  option: PlanOption;
  selected: boolean;
  onPress: () => void;
  onReview: () => void;
  index: number;
}) => {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 280,
      delay: index * 70,
      useNativeDriver: true,
    }).start();
  }, [animated, index]);

  return (
    <Animated.View
      style={{
        opacity: animated,
        transform: [
          {
            translateY: animated.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 0],
            }),
          },
        ],
      }}
    >
      <OptionCard option={option} selected={selected} onPress={onPress} onReview={onReview} />
    </Animated.View>
  );
};

export const PlanOptionsScreen = ({ tripId, route }: PlanOptionsProps) => {
  const { state, selectPlanForTrip, selectTrip } = useAppStore();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const resolvedTripId = tripId ?? route?.params?.tripId;
  const trip = state.trips.find((item) => item.id === resolvedTripId);

  const [options, setOptions] = useState<PlanOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [showRefine, setShowRefine] = useState(false);
  const [refine, setRefine] = useState<RefineState>({
    pace: trip?.pace ?? 'balanced',
    budget: 'comfort',
    interests: trip?.interests.slice(0, 3) ?? [],
  });

  const sheetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trip && trip.id !== state.selectedTripId) {
      selectTrip(trip.id);
    }
  }, [trip, selectTrip, state.selectedTripId]);

  useEffect(() => {
    if (!resolvedTripId) {
      return;
    }

    setIsInitialLoading(true);
    const timeout = setTimeout(() => {
      const initialOptions = getPlanOptionsForTrip(resolvedTripId);
      setOptions(initialOptions);
      setSelectedOptionId(trip?.selectedOptionId ?? null);
      setIsInitialLoading(false);
    }, 680);

    return () => clearTimeout(timeout);
  }, [resolvedTripId, trip?.selectedOptionId]);

  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: showRefine ? 1 : 0,
      duration: showRefine ? 240 : 180,
      useNativeDriver: true,
    }).start();
  }, [showRefine, sheetAnim]);

  if (!trip) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.colors.textSecondary }}>Select a planning trip to view options.</Text>
      </View>
    );
  }

  const selectedOption = options.find((option) => option.id === selectedOptionId) ?? null;

  const toggleInterest = (interest: string) => {
    Haptics.selectionAsync();
    setRefine((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  };

  const applyRefine = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsApplying(true);

    setTimeout(() => {
      const next = getRefinedPlanOptions(trip.id, refine);
      setOptions(next);
      setSelectedOptionId(next[0]?.id ?? null);
      setIsApplying(false);
      setShowRefine(false);
    }, 700);
  };

  const sheetStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: sheetAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [460, 0],
          }),
        },
      ],
    }),
    [sheetAnim],
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Hero
          imageSource={imageByKey[trip.coverImageKey] ?? imageByKey.default}
          glassContent={
            <View>
              <Text style={[theme.typography.heroEyebrow, styles.heroTag, { color: theme.colors.onImageSecondary }]}>Curated intelligence</Text>
              <Text style={[theme.typography.heroTitle, styles.heroTitle, { color: theme.colors.onImagePrimary }]}>{trip.destination}</Text>
              <Text style={[theme.typography.heroSub, styles.heroMeta, { color: theme.colors.onImageSecondary }]}>{formatDateRange(trip.dateStart, trip.dateEnd)}</Text>
              <Text style={[theme.typography.heroEyebrow, styles.heroHint, { color: theme.colors.onImageTertiary }]}>Based on your pace and interests.</Text>
            </View>
          }
        />

        <View style={styles.titleWrap}>
          <Text style={[theme.typography.h2, { color: theme.colors.textPrimary }]}>Choose your plan</Text>
          <Text style={[styles.subtitle, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>High-level day-by-day guidance. You can refine anytime.</Text>
          <Button label="Refine" variant="secondary" onPress={() => setShowRefine(true)} style={styles.refineButton} />
        </View>

        {isInitialLoading || isApplying ? (
          <View style={styles.skeletonWrap}>
            <ActivityIndicator color={theme.colors.primary} />
            {[1, 2, 3].map((item) => (
              <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.spacing.lg }]} />
            ))}
            <Text style={[styles.loadingText, theme.typography.bodyStrongSmall, { color: theme.colors.textSecondary }]}>
              {isApplying ? 'Regenerating...' : 'Curating options...'}
            </Text>
          </View>
        ) : (
          <View style={styles.optionsWrap}>
            {options.slice(0, 4).map((option, index) => (
              <AnimatedOptionCard
                key={option.id}
                option={option}
                selected={option.id === selectedOptionId}
                index={index}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedOptionId(option.id);
                }}
                onReview={() =>
                  (navigation as any).navigate('TripsTab', {
                    screen: 'PlanOptionDetail',
                    params: { tripId: trip.id, optionId: option.id },
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      {selectedOption ? (
        <View
          style={[
            styles.stickyBar,
            {
              backgroundColor: `${theme.colors.surface}EE`,
              borderTopColor: theme.colors.cardBorder,
              paddingBottom: insets.bottom + 10,
            },
          ]}
        >
          <Text style={[styles.stickyLabel, theme.typography.bodyStrongSmall, { color: theme.colors.textSecondary }]}>Selected: {selectedOption.title}</Text>
          <Button
            label="Select plan"
            onPress={() => {
              selectPlanForTrip(trip.id, selectedOption.id);
              (navigation as any).navigate('TripsTab', { screen: 'TripDetail', params: { tripId: trip.id } });
            }}
          />
        </View>
      ) : null}

      <Modal visible={showRefine} transparent animationType="none" onRequestClose={() => setShowRefine(false)}>
        <View style={styles.sheetRoot}>
          <Pressable style={styles.sheetBackdrop} onPress={() => setShowRefine(false)} />
          <Animated.View style={[styles.sheetWrap, sheetStyle]}>
            <BlurView intensity={40} tint="light" style={[styles.sheet, { borderColor: theme.colors.cardBorder, borderRadius: theme.spacing.xl }]}>
              <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Refine plan style</Text>

              <Text style={[styles.sheetLabel, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>Pace</Text>
              <View style={styles.inlineRow}>
                {(['relaxed', 'balanced', 'packed'] as TravelPace[]).map((pace) => (
                  <Button
                    key={pace}
                    label={pace[0].toUpperCase() + pace.slice(1)}
                    variant={refine.pace === pace ? 'primary' : 'secondary'}
                    onPress={() => setRefine((current) => ({ ...current, pace }))}
                    style={styles.inlineButton}
                  />
                ))}
              </View>

              <View style={[styles.separator, { backgroundColor: theme.colors.cardBorder }]} />

              <Text style={[styles.sheetLabel, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>Budget</Text>
              <View style={styles.inlineRow}>
                {(['value', 'comfort', 'premium'] as PlanBudget[]).map((budget) => (
                  <Button
                    key={budget}
                    label={budget[0].toUpperCase() + budget.slice(1)}
                    variant={refine.budget === budget ? 'primary' : 'secondary'}
                    onPress={() => setRefine((current) => ({ ...current, budget }))}
                    style={styles.inlineButton}
                  />
                ))}
              </View>

              <View style={[styles.separator, { backgroundColor: theme.colors.cardBorder }]} />

              <Text style={[styles.sheetLabel, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>Interests</Text>
              <View style={styles.interestWrap}>
                {interestOptions.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    selected={refine.interests.includes(interest)}
                    onPress={() => toggleInterest(interest)}
                  />
                ))}
              </View>

              <View style={styles.sheetActions}>
                <Button label="Apply" onPress={applyRefine} />
                <Button label="Cancel" variant="secondary" onPress={() => setShowRefine(false)} />
              </View>
            </BlurView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 128,
    gap: 14,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  heroTag: {
  },
  heroTitle: {
    marginTop: 4,
  },
  heroMeta: {
    marginTop: 2,
  },
  heroHint: {
    marginTop: 8,
  },
  titleWrap: {
    gap: 6,
  },
  subtitle: {
  },
  refineButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  optionsWrap: {
    gap: 12,
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  stickyLabel: {
  },
  skeletonWrap: {
    gap: 10,
    alignItems: 'center',
    paddingTop: 10,
  },
  skeletonCard: {
    width: '100%',
    height: 130,
  },
  loadingText: {
    marginTop: 4,
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.3)',
  },
  sheetWrap: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  sheet: {
    padding: 16,
    gap: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sheetLabel: {
    marginTop: 4,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  inlineButton: {
    minWidth: 94,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
  interestWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sheetActions: {
    gap: 8,
    marginTop: 8,
  },
});

