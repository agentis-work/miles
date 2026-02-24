import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Hero } from '../components/ui/Hero';
import { EmptyState } from '../components/ui/EmptyState';
import { Chip } from '../components/ui/Chip';
import { SuggestionCard } from '../components/travel/SuggestionCard';
import { AreaPickerSheet } from '../components/travel/AreaPickerSheet';
import { imageByKey } from '../mock/images';
import { useAppStore, getAreasForTripDestination } from '../state/AppStore';
import { selectActiveTrip } from '../state/selectors';
import { useTheme } from '../theme/useTheme';

const categories = ['near', 'food', 'landmark', 'walk', 'indoor', 'family'];

export const ExploreScreen = () => {
  const { state, saveSuggestion, selectSuggestion, changeArea, completeTrip, logTripEvent } = useAppStore();
  const theme = useTheme();
  const navigation = useNavigation();
  const activeTrip = selectActiveTrip(state);
  const [selectedCategory, setSelectedCategory] = useState('near');
  const [toast, setToast] = useState<string | null>(null);
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const lastViewedSignatureRef = useRef('');

  if (!activeTrip) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <EmptyState
          title="No active trip"
          description="When a trip enters active mode, nearby suggestions appear here."
          actionLabel="Go to Trips"
          onActionPress={() => (navigation as any).navigate('TripsTab')}
        />
      </ScrollView>
    );
  }

  const areas = getAreasForTripDestination(activeTrip.destination);
  const currentSuggestions = state.exploreSuggestions
    .filter((item) => item.tripId === activeTrip.id)
    .slice(0, 4);

  const currentArea = currentSuggestions[0]?.areaName ?? areas[0];

  const filteredSuggestions = useMemo(() => {
    if (selectedCategory === 'near') {
      return currentSuggestions;
    }

    return currentSuggestions.filter((item) => {
      if (selectedCategory === 'landmark') {
        return item.category === 'culture';
      }
      if (selectedCategory === 'walk') {
        return item.category === 'nature';
      }
      if (selectedCategory === 'indoor') {
        return item.category === 'shopping' || item.category === 'culture';
      }
      if (selectedCategory === 'family') {
        return item.category !== 'nightlife';
      }
      return item.category === selectedCategory;
    });
  }, [currentSuggestions, selectedCategory]);

  const viewedSignature = useMemo(() => {
    return `${activeTrip.id}:${currentArea}:${filteredSuggestions.map((item) => item.id).join(',')}`;
  }, [activeTrip.id, currentArea, filteredSuggestions]);

  useEffect(() => {
    if (!filteredSuggestions.length) {
      return;
    }

    if (lastViewedSignatureRef.current === viewedSignature) {
      return;
    }
    lastViewedSignatureRef.current = viewedSignature;

    logTripEvent(activeTrip.id, 'suggestion_viewed', {
      areaName: currentArea,
      suggestionIds: filteredSuggestions.map((item) => item.id),
    });
  }, [activeTrip.id, currentArea, filteredSuggestions, logTripEvent, viewedSignature]);

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <Hero
          imageUri={imageByKey[activeTrip.coverImageKey] ?? imageByKey.default}
          height={228}
          glassContent={
            <View>
              <View style={styles.liveRow}>
                <View style={[styles.liveDot, { backgroundColor: theme.colors.accent }]} />
                <Text style={styles.liveText}>Live</Text>
              </View>
              <Text style={styles.heroTitle}>You&apos;re in {currentArea}</Text>
              <Text style={styles.heroSub}>Curated suggestions nearby</Text>
            </View>
          }
        />

        <View style={styles.topActions}>
          <Pressable onPress={() => setShowAreaPicker(true)}>
            <Text style={[styles.areaAction, { color: theme.colors.primary }]}>Area</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              completeTrip(activeTrip.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              (navigation as any).navigate('LifecycleTab');
            }}
          >
            <Text style={[styles.endTrip, { color: theme.colors.textSecondary }]}>End trip</Text>
          </Pressable>
        </View>

        <View style={styles.chipsRow}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category[0].toUpperCase() + category.slice(1)}
              selected={selectedCategory === category}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(category);
              }}
            />
          ))}
        </View>

        <View style={styles.list}>
          {(filteredSuggestions.length ? filteredSuggestions : currentSuggestions).slice(0, 4).map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onSave={() => {
                saveSuggestion(activeTrip.id, suggestion);
                setToast('Saved for later');
                setTimeout(() => setToast(null), 1400);
              }}
              onGuide={() => {
                selectSuggestion(activeTrip.id, suggestion);
                setToast('Saved to Reflect');
                setTimeout(() => setToast(null), 1400);
              }}
              onSwap={() => {
                changeArea(activeTrip.id, currentArea);
              }}
            />
          ))}
        </View>
      </ScrollView>

      <AreaPickerSheet
        visible={showAreaPicker}
        areas={areas}
        selectedArea={currentArea}
        onClose={() => setShowAreaPicker(false)}
        onSelect={(areaName) => {
          changeArea(activeTrip.id, areaName);
        }}
      />

      {toast ? (
        <View style={[styles.toast, { backgroundColor: theme.colors.primaryStrong }]}> 
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
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
    paddingBottom: 24,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    marginTop: 6,
    color: 'white',
    fontSize: 26,
    fontWeight: '700',
  },
  heroSub: {
    marginTop: 5,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaAction: {
    fontSize: 15,
    fontWeight: '700',
  },
  endTrip: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  list: {
    gap: 12,
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toastText: {
    color: '#FFF7EA',
    fontSize: 13,
    fontWeight: '600',
  },
});