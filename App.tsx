import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import { Spectral_500Medium } from "@expo-google-fonts/spectral";
import AppNavigator from "./src/navigation/AppNavigator";
import StarfieldBackground from "./src/components/StarfieldBackground";
import { colors } from "./src/theme/colors";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Spectral_500Medium,
  });

  // Masque le splash dès que les fonts sont prêtes OU en erreur.
  // Ne jamais bloquer le splash indéfiniment sur device physique.
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <StarfieldBackground />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
