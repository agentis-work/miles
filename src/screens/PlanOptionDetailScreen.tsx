import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TripsStackParamList } from '../app/navigation/TripsStack';
import { DayCard } from '../components/travel/DayCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Hero } from '../components/ui/Hero';
import { imageByKey } from '../mock/images';
import { getPlanOptionById } from '../mock/aiMocks';
import { useAppStore } from '../state/AppStore';
import { useTheme } from '../theme/useTheme';
import { formatDateRange } from '../utils/date';

type Props = NativeStackScreenProps<TripsStackParamList, 'PlanOptionDetail'>;

type DetailTab = 'itinerary' | 'included' | 'notes';

const TabButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();

  return (
    <Button
      label={label}
      variant={active ? 'primary' : 'secondary'}
      onPress={onPress}
      style={{ minWidth: 102 }}
    />
  );
};

export const PlanOptionDetailScreen = ({ route, navigation }: Props) => {
  const { state, selectPlanForTrip, selectTrip } = useAppStore();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const trip = state.trips.find((item) => item.id === route.params.tripId);
  const option = useMemo(() => {
    return getPlanOptionById(route.params.tripId, route.params.optionId);
  }, [route.params.optionId, route.params.tripId]);

  const [activeTab, setActiveTab] = useState<DetailTab>('itinerary');

  if (!trip || !option) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.colors.textSecondary }}>Plan not found.</Text>
      </View>
    );
  }

  const selectPlan = () => {
    selectTrip(trip.id);
    selectPlanForTrip(trip.id, option.id);
    navigation.replace('TripDetail', { tripId: trip.id });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Hero
          imageUri={imageByKey[trip.coverImageKey] ?? imageByKey.default}
          title={option.title}
          subtitle={formatDateRange(trip.dateStart, trip.dateEnd)}
          helperText={option.summary}
          height={232}
        />

        <Card>
          <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>{option.title}</Text>
          <Text style={[styles.optionSummary, { color: theme.colors.textSecondary }]}>{option.summary}</Text>

          <View style={styles.tabsRow}>
            <TabButton label="Itinerary" active={activeTab === 'itinerary'} onPress={() => setActiveTab('itinerary')} />
            <TabButton label="Included" active={activeTab === 'included'} onPress={() => setActiveTab('included')} />
            <TabButton label="Notes" active={activeTab === 'notes'} onPress={() => setActiveTab('notes')} />
          </View>
        </Card>

        {activeTab === 'itinerary' ? (
          <View style={styles.sectionWrap}>
            {option.itinerary.map((day) => (
              <DayCard key={day.dayNumber} day={day} imageUri={imageByKey[trip.coverImageKey] ?? imageByKey.default} />
            ))}
          </View>
        ) : null}

        {activeTab === 'included' ? (
          <Card>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Inclusions</Text>
            {(option.included?.inclusions ?? ['Day-by-day guidance', 'Priority recommendation map']).map((item) => (
              <Text key={item} style={[styles.line, { color: theme.colors.textSecondary }]}>- {item}</Text>
            ))}

            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginTop: 12 }]}>Exclusions</Text>
            {(option.included?.exclusions ?? ['Flights and hotels are not auto-booked']).map((item) => (
              <Text key={item} style={[styles.line, { color: theme.colors.textSecondary }]}>- {item}</Text>
            ))}
          </Card>
        ) : null}

        {activeTab === 'notes' ? (
          <Card>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Practical notes</Text>
            {(option.notes ?? ['You can refine this plan anytime before booking.', 'The itinerary adapts to your selected pace.']).map((item) => (
              <Text key={item} style={[styles.line, { color: theme.colors.textSecondary }]}>- {item}</Text>
            ))}
          </Card>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.sticky,
          {
            backgroundColor: `${theme.colors.surface}EE`,
            borderTopColor: theme.colors.cardBorder,
            paddingBottom: insets.bottom + 10,
          },
        ]}
      >
        <Button label="Select this plan" onPress={selectPlan} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSummary: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  sectionWrap: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  line: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  sticky: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});