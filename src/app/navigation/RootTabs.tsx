import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
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
import { Chip } from '../../components/ui/Chip';

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
  const prevLifecycle = useRef(lifecycleKey);
  const currentOpacity = useRef(new Animated.Value(1)).current;
  const previousOpacity = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();
  const [activeLifecycle, setActiveLifecycle] = React.useState(lifecycleKey);
  const [previousLifecycle, setPreviousLifecycle] = React.useState<typeof lifecycleKey | null>(null);

  const renderLifecycleContent = (key: typeof lifecycleKey) => {
    if (key === 'planning') {
      if (currentTrip && currentTrip.status === 'planning') {
        return <PlanOptionsScreen tripId={currentTrip.id} />;
      }
      return <PlanHomeScreen />;
    }

    if (key === 'preparing') {
      return <PrepareDashboardScreen />;
    }

    if (key === 'active') {
      return <ExploreScreen />;
    }

    return <ReflectScreen />;
  };

  useEffect(() => {
    if (prevLifecycle.current !== lifecycleKey) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPreviousLifecycle(activeLifecycle);
      setActiveLifecycle(lifecycleKey);
      prevLifecycle.current = lifecycleKey;

      if (reducedMotion) {
        previousOpacity.setValue(0);
        currentOpacity.setValue(1);
        setPreviousLifecycle(null);
        return;
      }

      previousOpacity.setValue(1);
      currentOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(previousOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(currentOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setPreviousLifecycle(null);
      });
    }
  }, [activeLifecycle, currentOpacity, lifecycleKey, previousOpacity, reducedMotion]);

  const lifecycleLabel = useMemo(() => getLifecycleTabLabel(lifecycleKey), [lifecycleKey]);

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.lifecycleHeader, { borderBottomColor: theme.colors.cardBorder, backgroundColor: theme.colors.background }]}>
        <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Current mode</Text>
        <Chip label={lifecycleLabel} selected />
      </View>

      <View style={styles.flex}>
        {previousLifecycle ? (
          <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: previousOpacity }]}>
            {renderLifecycleContent(previousLifecycle)}
          </Animated.View>
        ) : null}
        <Animated.View style={[styles.flex, { opacity: currentOpacity }]}>{renderLifecycleContent(activeLifecycle)}</Animated.View>
      </View>
    </View>
  );
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
          { borderRadius: theme.spacing.sm },
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
          paddingTop: theme.spacing.xs,
          height: 84,
        },
        tabBarLabelStyle: {
          ...theme.typography.caption,
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
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lifecycleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
