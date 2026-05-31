import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { PaperProvider, DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FADADD", // 🌸 Rose pâle
    accent: "#FFB6C1",  // 💖 Rose clair
    background: "#FFF0F5", // 🎀 Fond rose léger
    text: "#5A5A5A", // 🖤 Texte gris foncé
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
    </PaperProvider>
  );
}
