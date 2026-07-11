import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconHome, IconBabyBottle, IconHistory, IconChartBar, IconScan } from '@tabler/icons-react-native';
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { circleRadius } from "../theme/radius";
import { accentShadowSoft } from "../theme/shadows";
import { isFirstLaunch } from "../storage/settingsStorage";
import { Bottle } from "../storage/bottleStorage";
import AddBottleScreen from "../screens/AddBottleScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HomeScreen from "../screens/HomeScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import ScanScreen from "../screens/ScanScreen";
import SettingsScreen from "../screens/SettingsScreen";
import StatsScreen from "../screens/StatsScreen";

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
  Stats: undefined;
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
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 10, fontWeight: '700' },
        tabBarItemStyle: { flex: 1 },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) =>
            <IconHome color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Ajout"
        component={AddBottleScreen}
        options={{
          tabBarLabel: '',
          tabBarItemStyle: { flex: 1, marginBottom: 10 },
          tabBarIcon: () => (
            <View style={[{
              width: 60, height: 60, borderRadius: circleRadius(60),
              backgroundColor: colors.accent,
              alignItems: 'center', justifyContent: 'center',
            }, accentShadowSoft]}>
              <IconBabyBottle color={colors.textOnAccent} size={28} />
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
            <IconHistory color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) =>
            <IconChartBar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) =>
            <IconScan color={color} size={size} />,
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
