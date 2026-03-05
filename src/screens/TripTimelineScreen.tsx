import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TripsStackParamList } from '../app/navigation/TripsStack';
import { MilesWordmarkHeader } from '../components/brand/MilesWordmarkHeader';
import { DaySection } from '../components/timeline/DaySection';
import { getSampleTimeline } from '../data/timelineSample';
import { useAppStore } from '../state/AppStore';
import { useTheme } from '../theme/useTheme';
import { formatDateRange } from '../utils/date';

type Props = NativeStackScreenProps<TripsStackParamList, 'TripTimeline'>;

type TimelineSection = {
  title: string;
  dayDateLabel: string;
  dateISO: string;
  isToday: boolean;
  data: [number];
};

const parseIsoDate = (iso: string): Date | null => {
  const [yearText, monthText, dayText] = iso.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toDayDateLabel = (iso: string) => {
  const date = parseIsoDate(iso);
  if (!date) {
    return iso;
  }

  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = date.getDate();
  return `${month} ${day}`;
};

const isIsoWithinRange = (value: string, startISO: string, endISO: string) => value >= startISO && value <= endISO;

export const TripTimelineScreen = ({ route, navigation }: Props) => {
  const { state, selectTrip } = useAppStore();
  const theme = useTheme();
  const listRef = useRef<SectionList<number, TimelineSection>>(null);

  const trip = state.trips.find((item) => item.id === route.params.tripId);

  const destination = route.params.destination || trip?.destination || 'Trip';
  const country = route.params.country || trip?.country || 'Country pending';
  const startISO = route.params.startISO || trip?.dateStart || toIsoDate(new Date());
  const endISO = route.params.endISO || trip?.dateEnd || startISO;

  useEffect(() => {
    if (trip && trip.id !== state.selectedTripId) {
      selectTrip(trip.id);
    }
  }, [trip, state.selectedTripId, selectTrip]);

  const timeline = useMemo(() => {
    return getSampleTimeline(route.params.tripId, destination, startISO, endISO);
  }, [route.params.tripId, destination, startISO, endISO]);

  const todayISO = toIsoDate(new Date());
  const todayDayIndex = timeline.days.findIndex((day) => day.dateISO === todayISO);
  const isTripActiveToday = isIsoWithinRange(todayISO, startISO, endISO);

  const dayProgressLabel = useMemo(() => {
    if (!isTripActiveToday || todayDayIndex < 0) {
      return `${timeline.days.length} days planned`;
    }

    return `Day ${todayDayIndex + 1} of ${timeline.days.length}`;
  }, [isTripActiveToday, timeline.days.length, todayDayIndex]);

  const sections = useMemo<TimelineSection[]>(() => {
    return timeline.days.map((day, index) => ({
      title: day.label,
      dayDateLabel: toDayDateLabel(day.dateISO),
      dateISO: day.dateISO,
      isToday: todayDayIndex === index,
      data: [index],
    }));
  }, [timeline.days, todayDayIndex]);

  useEffect(() => {
    if (!isTripActiveToday || todayDayIndex < 0) {
      return;
    }

    const timeout = setTimeout(() => {
      listRef.current?.scrollToLocation({
        sectionIndex: todayDayIndex,
        itemIndex: 0,
        animated: true,
        viewOffset: 120,
      });
    }, 200);

    return () => clearTimeout(timeout);
  }, [isTripActiveToday, todayDayIndex]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <MilesWordmarkHeader
        rightSlot={
          <Pressable onPress={() => navigation.goBack()} accessibilityRole="button">
            <Text style={[theme.typography.button, { color: theme.colors.textPrimary }]}>Back</Text>
          </Pressable>
        }
      />

      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(item) => String(item)}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}> 
            <Text style={[theme.typography.h2, { color: theme.colors.textPrimary }]}>{destination}</Text>
            <Text style={[styles.country, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>{country}</Text>
            <Text style={[styles.dates, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>{formatDateRange(startISO, endISO)}</Text>
            <Text style={[styles.progress, theme.typography.bodyStrongSmall, { color: theme.colors.primaryStrong }]}>{dayProgressLabel}</Text>
          </View>
        }
        renderSectionHeader={({ section }) => {
          const dayIndex = section.data[0];
          const day = timeline.days[dayIndex];

          return (
            <DaySection
              day={day}
              dayDateLabel={section.dayDateLabel}
              isToday={section.isToday && isTripActiveToday}
            />
          );
        }}
        renderItem={() => null}
        onScrollToIndexFailed={() => {
          // Section offsets depend on dynamic card heights; fallback skip is acceptable.
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
    paddingTop: 10,
    paddingBottom: 90,
  },
  summaryCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  country: {
    marginTop: 2,
  },
  dates: {
    marginTop: 6,
  },
  progress: {
    marginTop: 8,
  },
});
