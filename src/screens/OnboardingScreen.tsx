import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { saveSettings } from "../storage/settingsStorage";
import { DAILY_GOAL_DEFAULT } from "../config/constants";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography, fonts } from "../theme/typography";

type Props = { onDone: () => void };

export default function OnboardingScreen({ onDone }: Props) {
  const [step,      setStep]      = useState<1 | 2>(1);
  const [childName, setChildName] = useState('');
  const [dailyGoal, setDailyGoal] = useState(DAILY_GOAL_DEFAULT);

  async function handleStart() {
    await saveSettings({
      childName: childName.trim() || 'bébé',
      dailyGoal,
      isOnboardingDone: true,
    });
    onDone();
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior="padding"
    >
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      {/* ── Indicateur d'étapes ── */}
      <View style={s.dots}>
        <View style={[s.dot, step === 1 && s.dotActive]} />
        <View style={[s.dot, step === 2 && s.dotActive]} />
      </View>

      {step === 1 ? (
        /* ── Étape 1 : prénom ── */
        <View style={s.step}>
          <Text style={s.emoji}>👶</Text>
          <Text style={s.title}>Quel est le prénom{'\n'}de bébé ?</Text>
          <Text style={s.subtitle}>
            Vous pourrez le modifier dans les paramètres.
          </Text>

          <View style={s.inputBox}>
            <TextInput
              style={s.input}
              value={childName}
              onChangeText={setChildName}
              placeholder="Prénom de bébé"
              placeholderTextColor={colors.muted}
              autoCapitalize="words"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => setStep(2)}
            />
          </View>

          <TouchableOpacity style={s.btn} onPress={() => setStep(2)} activeOpacity={0.85}>
            <Text style={s.btnText}>Suivant →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ── Étape 2 : objectif ── */
        <View style={s.step}>
          <Text style={s.emoji}>🍼</Text>
          <Text style={s.title}>Objectif journalier</Text>
          <Text style={s.subtitle}>
            Quantité totale de lait par jour{'\n'}(recommandé : 700–900 ml).
          </Text>

          <View style={s.goalRow}>
            <TouchableOpacity
              style={s.adjBtn}
              onPress={() => setDailyGoal(g => Math.max(200, g - 50))}
              activeOpacity={0.7}
            >
              <Text style={s.adjBtnText}>−</Text>
            </TouchableOpacity>

            <View style={s.goalValueBox}>
              <Text style={s.goalValue}>{dailyGoal}</Text>
              <Text style={s.goalUnit}>ml</Text>
            </View>

            <TouchableOpacity
              style={[s.adjBtn, s.adjBtnPlus]}
              onPress={() => setDailyGoal(g => g + 50)}
              activeOpacity={0.7}
            >
              <Text style={s.adjBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.btn} onPress={handleStart} activeOpacity={0.85}>
            <Text style={s.btnText}>Commencer ✓</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.backLink} onPress={() => setStep(1)}>
            <Text style={s.backLinkText}>← Retour</Text>
          </TouchableOpacity>
        </View>
      )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg * 1.5,
    paddingVertical: 40,
  },

  // Indicateur étapes
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 44,
  },
  dot: {
    height: 8, width: 8, borderRadius: 4,
    backgroundColor: 'rgba(167,139,250,0.25)',
  },
  dotActive: { width: 24, backgroundColor: colors.accent },

  // Contenu d'étape
  step: { alignItems: 'center' },
  emoji: { fontSize: 48, marginBottom: 20 },
  title: {
    fontFamily: fonts.extraBold, fontSize: 28, fontWeight: '900',
    color: colors.text, textAlign: 'center', lineHeight: 34, marginBottom: 10,
  },
  subtitle: {
    ...typography.small, color: colors.muted, textAlign: 'center', marginBottom: 32,
  },

  // Champ prénom
  inputBox: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.xl, paddingVertical: 14,
    marginBottom: 20,
  },
  input: {
    fontFamily: fonts.bold, fontSize: 20, fontWeight: '700',
    color: colors.text, textAlign: 'center',
  },

  // Sélecteur objectif
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 28 },
  adjBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.card2,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  adjBtnPlus: { backgroundColor: colors.accent, borderColor: colors.accent },
  adjBtnText: { color: colors.text, fontSize: 26, lineHeight: Platform.OS === 'android' ? 32 : 26 },
  goalValueBox: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  goalValue: {
    fontFamily: fonts.extraBold, fontSize: 52, fontWeight: '900',
    color: colors.text, lineHeight: 52,
  },
  goalUnit: {
    fontFamily: fonts.bold, fontSize: 18, fontWeight: '700',
    color: colors.acL, paddingBottom: 4,
  },

  // Bouton principal
  btn: {
    width: '100%', paddingVertical: 17, borderRadius: 16,
    backgroundColor: colors.accent, alignItems: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.38, shadowRadius: 11,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8, marginBottom: 16,
  },
  btnText: {
    fontFamily: fonts.extraBold, fontSize: 16, fontWeight: '800', color: 'white',
  },

  // Lien retour
  backLink: { paddingVertical: 8 },
  backLinkText: { ...typography.small, color: colors.muted, fontWeight: '600' },
});
