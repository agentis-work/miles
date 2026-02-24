import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Hero } from '../components/ui/Hero';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { imageByKey } from '../mock/images';
import { useTheme } from '../theme/useTheme';

const sampleDestinations = ['Kyoto', 'Lisbon', 'Copenhagen', 'Marrakech'];

export const PlanHomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [showExamples, setShowExamples] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Hero
        imageUri={imageByKey.default}
        height={248}
        glassContent={
          <>
            <Text style={styles.tag}>TRAILO</Text>
            <Text style={styles.title}>Your intelligent travel guide</Text>
            <Text style={styles.subtitle}>Plan your next trip with calm, high-level guidance tailored to your pace and priorities.</Text>
          </>
        }
      />

      <Card>
        <Button
          label="Create a trip"
          onPress={() => {
            (navigation as any).navigate('TripsTab', { screen: 'CreateTrip' });
          }}
        />
        <View style={{ height: 10 }} />
        <Button
          label={showExamples ? 'Hide examples' : 'Browse examples'}
          variant="secondary"
          onPress={() => setShowExamples((value) => !value)}
        />

        {showExamples ? (
          <View style={styles.examples}>
            {sampleDestinations.map((item) => (
              <Pressable
                key={item}
                style={[styles.exampleChip, { borderColor: theme.colors.cardBorder, backgroundColor: theme.colors.surfaceMuted }]}
                onPress={() => {
                  (navigation as any).navigate('TripsTab', { screen: 'CreateTrip', params: { destinationPrefill: item } });
                }}
              >
                <Text style={[styles.exampleText, { color: theme.colors.textPrimary }]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
  tag: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 4,
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.7,
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    lineHeight: 19,
  },
  examples: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  exampleText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
