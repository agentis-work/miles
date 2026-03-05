import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TripsStackParamList } from '../app/navigation/TripsStack';
import { MilesWordmarkHeader } from '../components/brand/MilesWordmarkHeader';
import { PaywallModal } from '../components/travel/PaywallModal';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { Hero } from '../components/ui/Hero';
import { imageByKey } from '../mock/images';
import { Trip } from '../models/trip';
import { useAppStore } from '../state/AppStore';
import { getStatusPillLabel, selectCanCreateTrip, selectSelectedTrip } from '../state/selectors';
import { useTheme } from '../theme/useTheme';
import { formatDateRange, getTripDayCount } from '../utils/date';

type Props = NativeStackScreenProps<TripsStackParamList, 'TripsList'>;

const travelerLabel: Record<Trip['travelersType'], string> = {
  solo: 'Solo',
  couple: 'Couple',
  family: 'Family',
  group: 'Group',
};

const paceLabel: Record<Trip['pace'], string> = {
  relaxed: 'Relaxed',
  balanced: 'Balanced',
  packed: 'Packed',
};

const TripCard = ({
  trip,
  isCurrent,
  onPress,
}: {
  trip: Trip;
  isCurrent: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();
  const dayCount = getTripDayCount(trip.dateStart, trip.dateEnd);

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card style={styles.tripCard}>
        <Image
          source={imageByKey[trip.coverImageKey] ?? imageByKey.default}
          style={styles.tripImage}
          contentFit="cover"
          transition={150}
        />

        <View style={styles.cardContent}>
          <View style={styles.rowBetween}>
            <View style={styles.titleWrap}>
              <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>{trip.destination}</Text>
              <Text style={[styles.country, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>{trip.country || 'Destination pending'}</Text>
            </View>
            <Chip label={getStatusPillLabel(trip.status)} selected={isCurrent} />
          </View>

          <Text style={[styles.dateText, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>{formatDateRange(trip.dateStart, trip.dateEnd)}</Text>

          <View style={styles.metaRow}>
            <Chip label={dayCount ? `${dayCount} days` : 'Flexible dates'} />
            <Chip label={travelerLabel[trip.travelersType]} />
            <Chip label={paceLabel[trip.pace]} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

export const TripsListScreen = ({ navigation }: Props) => {
  const { state, selectTrip, setMembershipState } = useAppStore();
  const theme = useTheme();
  const [showPaywall, setShowPaywall] = useState(false);

  const selectedTrip = selectSelectedTrip(state);
  const canCreateTrip = selectCanCreateTrip(state);

  const heroImage = useMemo(() => {
    if (selectedTrip) {
      return imageByKey[selectedTrip.coverImageKey] ?? imageByKey.default;
    }
    return imageByKey.default;
  }, [selectedTrip]);

  return (
    <View style={styles.container}>
      <FlatList
        data={state.trips}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerArea}>
            <MilesWordmarkHeader />
            <View style={styles.hero}>
              <Hero
                imageSource={heroImage}
                glassContent={
                  <>
                    <Text style={[theme.typography.heroSub, styles.heroSub, { color: theme.colors.onImageSecondary }]}>Your AI travel guide.</Text>
                    <Text style={[theme.typography.heroEyebrow, styles.heroHint, { color: theme.colors.onImageTertiary }]}>
                      Calm planning, practical preparation, confident exploration, and thoughtful reflection in one place.
                    </Text>
                  </>
                }
              />
            </View>
            <View style={styles.tripsRow}>
              <Text style={[theme.typography.bodyStrong, { color: theme.colors.textPrimary }]}>Your Trips</Text>
              <Pressable
                onPress={() => {
                  if (!canCreateTrip) {
                    setShowPaywall(true);
                    return;
                  }
                  navigation.navigate('CreateTrip');
                }}
                style={[styles.floatingCta, { backgroundColor: theme.colors.primary, borderRadius: theme.spacing.md }]}
                accessibilityRole="button"
              >
                <Text style={[styles.floatingCtaText, theme.typography.button, { color: theme.colors.onPrimary }]}>New Trip</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            isCurrent={state.selectedTripId === item.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              selectTrip(item.id);
              navigation.navigate('TripDetail', { tripId: item.id });
            }}
          />
        )}
      />

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onEnableMembership={() => {
          setMembershipState({
            ...state.membershipState,
            hasMembership: true,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 120,
    gap: 12,
  },
  headerArea: {
    marginTop: 0,
    marginBottom: 4,
  },
  hero: {
    marginTop: 12,
  },
  heroSub: {
    marginTop: 2,
  },
  heroHint: {
    marginTop: 6,
  },
  tripsRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingCta: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: '#092019',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  floatingCtaText: {
  },
  tripCard: {
    padding: 0,
    overflow: 'hidden',
  },
  tripImage: {
    width: '100%',
    height: 136,
  },
  cardContent: {
    padding: 14,
    gap: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleWrap: {
    flexShrink: 1,
  },
  country: {
    marginTop: 2,
  },
  dateText: {
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});


