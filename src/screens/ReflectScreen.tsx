import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Hero } from '../components/ui/Hero';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { MemoryCard } from '../components/travel/MemoryCard';
import { ShareRecapModal } from '../components/travel/ShareRecapModal';
import { imageByKey } from '../mock/images';
import { useAppStore } from '../state/AppStore';
import { selectCurrentTrip } from '../state/selectors';
import { useTheme } from '../theme/useTheme';
import { formatDateRange } from '../utils/date';

export const ReflectScreen = () => {
  const { state, generateRecap } = useAppStore();
  const theme = useTheme();
  const trip = selectCurrentTrip(state);
  const [shareOpen, setShareOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  if (!trip || trip.status !== 'completed') {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <EmptyState title="Reflect unlocks after trips" description="Switch to a completed trip to review your recap." />
      </ScrollView>
    );
  }

  const recap = state.recapsByTripId[trip.id];
  const memories = useMemo(
    () => state.memories.filter((memory) => memory.tripId === trip.id).sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1)),
    [state.memories, trip.id],
  );

  const refreshRecap = () => {
    setRefreshing(true);
    setTimeout(() => {
      generateRecap(trip.id);
      setRefreshing(false);
    }, 760);
  };

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <Hero
          imageSource={imageByKey[trip.coverImageKey] ?? imageByKey.default}
          title="Reflect"
          subtitle={`${trip.destination} • ${formatDateRange(trip.dateStart, trip.dateEnd)}`}
          helperText="Your recap and moments"
        />

        <Card>
          <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Recap</Text>
          {refreshing ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={[styles.loadingText, theme.typography.bodyStrongSmall, { color: theme.colors.textSecondary }]}>Refreshing recap...</Text>
            </View>
          ) : recap ? (
            <>
              <Text style={[styles.summary, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>{recap.summary}</Text>
              <View style={styles.highlightWrap}>
                {recap.highlights.map((item) => (
                  <Chip key={item} label={item} />
                ))}
              </View>
              <View style={styles.recapActions}>
                <Button label="Share recap" onPress={() => setShareOpen(true)} />
                <Button label="Refresh recap" variant="secondary" onPress={refreshRecap} />
              </View>
            </>
          ) : (
            <View style={styles.recapActions}>
              <Text style={[styles.summary, theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>No recap available yet for this completed trip.</Text>
              <Button label="Create recap" onPress={() => generateRecap(trip.id)} />
            </View>
          )}
        </Card>

        <Card>
          <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>Timeline</Text>
          <View style={styles.timelineList}>
            {memories.length ? (
              memories.map((memory) => <MemoryCard key={memory.id} memory={memory} />)
            ) : (
              <EmptyState title="No moments yet" description="Moments captured during Explore will appear here." />
            )}
          </View>
        </Card>
      </ScrollView>

      {recap ? <ShareRecapModal visible={shareOpen} recap={recap} onClose={() => setShareOpen(false)} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 28,
  },
  summary: {
    marginTop: 8,
  },
  highlightWrap: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recapActions: {
    marginTop: 12,
    gap: 8,
  },
  timelineList: {
    marginTop: 10,
    gap: 10,
  },
  loadingRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
  },
});
