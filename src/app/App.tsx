import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootTabs } from './navigation/RootTabs';
import { AppStoreProvider, useAppStore } from '../state/AppStore';
import { selectCurrentMode } from '../state/selectors';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';

const AppShell = () => {
  const { state } = useAppStore();
  const mode = selectCurrentMode(state);

  if (!state.isHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider currentMode={mode}>
      <ThemedNavigation />
    </ThemeProvider>
  );
};

const ThemedNavigation = () => {
  const theme = useTheme();

  return (
    <LinearGradient colors={theme.gradients.ambient} style={styles.gradient}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
            card: theme.colors.background,
            text: theme.colors.textPrimary,
            primary: theme.colors.primary,
            border: theme.colors.cardBorder,
          },
        }}
      >
        <RootTabs />
      </NavigationContainer>
    </LinearGradient>
  );
};

export default function App() {
  return (
    <AppStoreProvider>
      <AppShell />
    </AppStoreProvider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});