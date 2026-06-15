import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from "../theme/colors";
import { isFirstLaunch } from "../storage/settingsStorage";
import { Bottle } from "../storage/bottleStorage";
import AddBottleScreen from "../screens/AddBottleScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HomeScreen from "../screens/HomeScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import ScanScreen from "../screens/ScanScreen";
import SettingsScreen from "../screens/SettingsScreen";

// ── Types ──────────────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Tabs: undefined;
  Paramètres: undefined;
  Édition: { bottle: Bottle };
};

export type TabParamList = {
  Accueil: undefined;
  Ajout: undefined;
  Historique: undefined;
  Scan: undefined;
};

// ── Navigateurs ────────────────────────────────────────────────────────────────
const Stack = createStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

// ── Tab bar ────────────────────────────────────────────────────────────────────
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: {
          backgroundColor: colors.navBg,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor:   colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarItemStyle: { flex: 1 },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) =>
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Ajout"
        component={AddBottleScreen}
        options={{
          tabBarLabel: '',
          tabBarItemStyle: { marginBottom: 10 },
          tabBarIcon: () => (
            <View style={{
              width: 60, height: 60, borderRadius: 30,
              backgroundColor: colors.accent,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: colors.accent,
              shadowOpacity: 0.5, shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 6,
            }}>
              <MaterialCommunityIcons name="baby-bottle-outline" color="white" size={28} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Historique"
        component={HistoryScreen}
        options={{
          title: "Historique",
          tabBarIcon: ({ color, size }) =>
            <MaterialCommunityIcons name="history" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) =>
            <MaterialCommunityIcons name="barcode-scan" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ── Navigateur racine ──────────────────────────────────────────────────────────
const AppNavigator = () => {
  const [isReady,        setIsReady]        = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    isFirstLaunch().then(first => {
      setShowOnboarding(first);
      setIsReady(true);
    });
  }, []);

  if (!isReady) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  if (showOnboarding) {
    return <OnboardingScreen onDone={() => setShowOnboarding(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'transparent' } }}>
        <Stack.Screen name="Tabs"       component={TabNavigator}   />
        <Stack.Screen
          name="Paramètres"
          component={SettingsScreen}
          options={{
            transitionSpec: {
              open:  { animation: 'timing', config: { duration: 280 } },
              close: { animation: 'timing', config: { duration: 220 } },
            },
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: { opacity: current.progress },
            }),
          }}
        />
        <Stack.Screen
          name="Édition"
          component={AddBottleScreen}
          options={{
            transitionSpec: {
              open:  { animation: 'timing', config: { duration: 280 } },
              close: { animation: 'timing', config: { duration: 220 } },
            },
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: { opacity: current.progress },
            }),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
