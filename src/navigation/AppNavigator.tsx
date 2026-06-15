import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { colors } from "../theme/colors";
import AddBottleScreen from "../screens/AddBottleScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HomeScreen from "../screens/HomeScreen";
import ScanScreen from "../screens/ScanScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Définition des types pour la navigation
export type RootStackParamList = {
  Accueil: undefined;
  Ajout: undefined;
  Historique: undefined;
  Scan: undefined;
};

const Tab = createBottomTabNavigator();


const AppNavigator = () => {
  return (
    <NavigationContainer>
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
          }}
        >
        <Tab.Screen
          name="Accueil"
          component={HomeScreen}
          options={{
            title: "Accueil",
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-outline" color={color} size={size} />
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
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="history" color={color} size={size} />
          }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            title: "Scan",
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="barcode-scan" color={color} size={size} />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
