import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { typography, fonts } from "../theme/typography";

const StatsScreen: React.FC = () => {
  return (
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.icon}>📊</Text>
        <Text style={s.title}>Statistiques</Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>Bientôt disponible</Text>
        </View>
        <Text style={s.body}>
          Fonctionnalité en cours de développement…
        </Text>
      </View>
    </View>
  );
};

export default StatsScreen;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon:  { fontSize: 40, marginBottom: 12 },
  title: { fontFamily: fonts.extraBold, fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 12 },
  badge: {
    backgroundColor: 'rgba(167,139,250,0.16)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  badgeText: { ...typography.caption, fontWeight: '700', color: colors.acL },
  body:      { ...typography.small, color: colors.muted, textAlign: 'center' },
});
