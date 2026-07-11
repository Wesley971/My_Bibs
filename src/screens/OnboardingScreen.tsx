import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, ScrollView,
} from "react-native";
import { IconBabyCarriage, IconBabyBottle, IconArrowRight, IconArrowLeft, IconCircleCheck } from '@tabler/icons-react-native';
import { saveSettings } from "../storage/settingsStorage";
import { DAILY_GOAL_DEFAULT } from "../config/constants";
import { Stepper } from '../components/Stepper';
import { Button } from '../components/Button';
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { radius } from "../theme/radius";
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
          <IconBabyCarriage size={48} color={colors.accent} />
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

          <Button onPress={() => setStep(2)} style={s.btn}>
            <View style={s.btnRow}>
              <Text style={s.btnText}>Suivant</Text>
              <IconArrowRight size={18} color={colors.textOnAccent} />
            </View>
          </Button>
        </View>
      ) : (
        /* ── Étape 2 : objectif ── */
        <View style={s.step}>
          <IconBabyBottle size={48} color={colors.accent} />
          <Text style={s.title}>Objectif journalier</Text>
          <Text style={s.subtitle}>
            Quantité totale de lait par jour{'\n'}(recommandé : 700–900 ml).
          </Text>

          <View style={s.stepperBox}>
            <Stepper
              value={dailyGoal}
              onDecrement={() => setDailyGoal(g => Math.max(200, g - 50))}
              onIncrement={() => setDailyGoal(g => g + 50)}
            />
          </View>

          <Button onPress={handleStart} style={s.btn}>
            <View style={s.btnRow}>
              <IconCircleCheck size={18} color={colors.textOnAccent} />
              <Text style={s.btnText}>Commencer</Text>
            </View>
          </Button>

          <TouchableOpacity style={s.backLink} onPress={() => setStep(1)} activeOpacity={0.7}>
            <View style={s.btnRow}>
              <IconArrowLeft size={14} color={colors.muted} />
              <Text style={s.backLinkText}>Retour</Text>
            </View>
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
    backgroundColor: colors.accentDim,
  },
  dotActive: { width: 24, backgroundColor: colors.accent },

  // Contenu d'étape
  step: { alignItems: 'center' },
  title: {
    marginTop: 20,
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
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.xl, paddingVertical: 14,
    marginBottom: 20,
  },
  input: {
    fontFamily: fonts.bold, fontSize: 20, fontWeight: '700',
    color: colors.text, textAlign: 'center',
  },

  // Sélecteur objectif
  stepperBox: { marginBottom: 28 },

  // Bouton principal
  btn: { marginBottom: 16 },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: {
    fontFamily: fonts.extraBold, fontSize: 16, fontWeight: '800', color: colors.textOnAccent,
  },

  // Lien retour
  backLink: { paddingVertical: 8 },
  backLinkText: { ...typography.small, color: colors.muted, fontWeight: '600' },
});
