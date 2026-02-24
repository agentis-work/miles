import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { TripsStack } from './TripsStack';
import { ExploreScreen } from '../../screens/ExploreScreen';
import { ReflectScreen } from '../../screens/ReflectScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';
import { PlanHomeScreen } from '../../screens/PlanHomeScreen';
import { PrepareDashboardScreen } from '../../screens/PrepareDashboardScreen';
import { PlanOptionsScreen } from '../../screens/PlanOptionsScreen';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../state/AppStore';
import { selectCurrentTrip, selectLifecycleKey } from '../../state/selectors';
import { getLifecycleTabLabel } from './lifecycleTabs';
import { useReducedMotion } from '../../utils/useReducedMotion';

export type RootTabParamList = {
  TripsTab: undefined;
  LifecycleTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const LifecycleTabContent = () => {
  const theme = useTheme();
  const { state } = useAppStore();
  const lifecycleKey = selectLifecycleKey(state);
  const currentTrip = selectCurrentTrip(state);
  const fade = useRef(new Animated.Value(1)).current;
  const prevLifecycle = useRef(lifecycleKey);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (prevLifecycle.current !== lifecycleKey) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      prevLifecycle.current = lifecycleKey;
      fade.setValue(reducedMotion ? 1 : 0.6);
      Animated.timing(fade, {
        toValue: 1,
        duration: reducedMotion ? 0 : 220,
        useNativeDriver: true,
      }).start();
    }
  }, [fade, lifecycleKey, reducedMotion]);

  const content = useMemo(() => {
    if (lifecycleKey === 'planning') {
      if (currentTrip && currentTrip.status === 'planning') {
        return <PlanOptionsScreen tripId={currentTrip.id} />;
      }
      return <PlanHomeScreen />;
    }

    if (lifecycleKey === 'preparing') {
      return <PrepareDashboardScreen />;
    }

    if (lifecycleKey === 'active') {
      return <ExploreScreen />;
    }

    return <ReflectScreen />;
  }, [currentTrip, lifecycleKey]);

  return <Animated.View style={[styles.flex, { opacity: fade, backgroundColor: theme.colors.background }]}>{content}</Animated.View>;
};

export const RootTabs = () => {
  const theme = useTheme();
  const { state } = useAppStore();
  const lifecycleKey = selectLifecycleKey(state);
  const lifecycleLabel = getLifecycleTabLabel(lifecycleKey);

  const lifecycleIconName =
    lifecycleKey === 'planning'
      ? 'bulb-outline'
      : lifecycleKey === 'preparing'
        ? 'shield-checkmark-outline'
        : lifecycleKey === 'active'
          ? 'navigate-outline'
          : 'book-outline';

  const lifecycleIconNameFocused =
    lifecycleKey === 'planning'
      ? 'bulb'
      : lifecycleKey === 'preparing'
        ? 'shield-checkmark'
        : lifecycleKey === 'active'
          ? 'navigate'
          : 'book';

  const renderIcon = (focused: boolean, activeName: React.ComponentProps<typeof Ionicons>['name'], inactiveName: React.ComponentProps<typeof Ionicons>['name']) => {
    const iconName = focused ? activeName : inactiveName;
    return (
      <View
        style={[
          styles.iconWrap,
          focused
            ? {
                backgroundColor: `${theme.colors.primary}1A`,
                borderColor: `${theme.colors.primary}33`,
              }
            : null,
        ]}
      >
        <Ionicons
          name={iconName}
          size={focused ? 19 : 18}
          color={focused ? theme.colors.primary : theme.colors.textSecondary}
        />
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarBackground: () => <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFillObject} />,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: `${theme.colors.cardBorder}C0`,
          paddingTop: 8,
          height: 84,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tab.Screen
        name="TripsTab"
        component={TripsStack}
        options={{
          title: 'Trips',
          tabBarIcon: ({ focused }) => renderIcon(focused, 'airplane', 'airplane-outline'),
        }}
      />
      <Tab.Screen
        name="LifecycleTab"
        component={LifecycleTabContent}
        options={{
          title: lifecycleLabel,
          tabBarIcon: ({ focused }) => renderIcon(focused, lifecycleIconNameFocused, lifecycleIconName),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => renderIcon(focused, 'person', 'person-outline'),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  iconWrap: {
    minWidth: 30,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
