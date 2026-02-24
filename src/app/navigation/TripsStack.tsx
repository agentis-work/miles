import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TripsListScreen } from '../../screens/TripsListScreen';
import { TripDetailScreen } from '../../screens/TripDetailScreen';
import { CreateTripScreen } from '../../screens/CreateTripScreen';
import { PlanOptionDetailScreen } from '../../screens/PlanOptionDetailScreen';
import { PlanOptionsScreen } from '../../screens/PlanOptionsScreen';
import { BookingsScreen } from '../../screens/BookingsScreen';
import { useTheme } from '../../theme/useTheme';

export type TripsStackParamList = {
  TripsList: undefined;
  TripDetail: { tripId: string };
  CreateTrip: { destinationPrefill?: string } | undefined;
  PlanOptions: { tripId: string };
  PlanOptionDetail: { tripId: string; optionId: string };
  Bookings: { tripId: string };
};

const Stack = createNativeStackNavigator<TripsStackParamList>();

export const TripsStack = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerTransparent: true,
        headerBlurEffect: 'systemMaterial',
        headerTintColor: theme.colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="TripsList" component={TripsListScreen} options={{ title: 'Trips' }} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} options={{ title: 'Trip' }} />
      <Stack.Screen name="CreateTrip" component={CreateTripScreen} options={{ title: 'Create Trip' }} />
      <Stack.Screen name="PlanOptions" component={PlanOptionsScreen} options={{ title: 'Plan' }} />
      <Stack.Screen name="PlanOptionDetail" component={PlanOptionDetailScreen} options={{ title: 'Plan Option' }} />
      <Stack.Screen name="Bookings" component={BookingsScreen} options={{ title: 'Bookings' }} />
    </Stack.Navigator>
  );
};
