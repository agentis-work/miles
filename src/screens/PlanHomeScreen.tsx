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
        imageSource={imageByKey.default}
        glassContent={
          <>
            <Text style={[theme.typography.heroSub, styles.subtitle, { color: theme.colors.onImageSecondary }]}>Your AI travel guide. Plan your next trip with calm, high-level guidance tailored to your pace and priorities.</Text>
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
                style={[styles.exampleChip, { borderColor: theme.colors.cardBorder, backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.spacing.sm }]}
                onPress={() => {
                  (navigation as any).navigate('TripsTab', { screen: 'CreateTrip', params: { destinationPrefill: item } });
                }}
              >
                <Text style={[styles.exampleText, theme.typography.bodyStrongSmall, { color: theme.colors.textPrimary }]}>{item}</Text>
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
  subtitle: {
    marginTop: 8,
  },
  examples: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  exampleText: {},
});
