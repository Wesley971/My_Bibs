import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { getSettings, saveSettings } from "../storage/settingsStorage";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography, fonts } from "../theme/typography";

export default function SettingsScreen({ navigation }: any) {
  const [childName, setChildName] = useState('');
  const [dailyGoal, setDailyGoal] = useState(800);
  const [saved,     setSaved]     = useState(false);

  useEffect(() => {
    getSettings().then(s => {
      setChildName(s.childName);
      setDailyGoal(s.dailyGoal);
    });
  }, []);

  async function handleSave() {
    await saveSettings({ childName: childName.trim() || 'bébé', dailyGoal });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigation.goBack();
    }, 800);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'transparent' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <View style={s.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={s.backBtn}
          >
            <Text style={s.backIcon}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={s.headerTitle}>Paramètres</Text>
            <Text style={s.headerSub}>Configurer l'application</Text>
          </View>
        </View>

        {/* ── Prénom ── */}
        <Text style={s.sectionLabel}>PRÉNOM DE BÉBÉ</Text>
        <View style={s.inputBox}>
          <TextInput
            style={s.input}
            value={childName}
            onChangeText={setChildName}
            placeholder="Prénom de bébé"
            placeholderTextColor={colors.muted}
            autoCapitalize="words"
          />
        </View>

        {/* ── Objectif journalier ── */}
        <Text style={[s.sectionLabel, { marginTop: 24 }]}>OBJECTIF JOURNALIER</Text>
        <View style={s.card}>
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
              <Text style={s.goalUnit}>ml / jour</Text>
            </View>

            <TouchableOpacity
              style={[s.adjBtn, s.adjBtnPlus]}
              onPress={() => setDailyGoal(g => g + 50)}
              activeOpacity={0.7}
            >
              <Text style={s.adjBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Bouton Enregistrer ── */}
        <TouchableOpacity
          style={[s.saveBtn, saved && s.saveBtnSuccess]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={s.saveBtnText}>
            {saved ? '✓  Enregistré !' : 'Enregistrer'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: 'transparent' },
  content: { padding: spacing.lg, paddingBottom: 60 },

  // Header
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingTop: 6, marginBottom: 28,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon:    { color: colors.text, fontSize: 24, lineHeight: 30, marginTop: -2 },
  headerTitle: { fontFamily: fonts.extraBold, fontSize: 20, fontWeight: '800', color: colors.text },
  headerSub:   { ...typography.caption, color: colors.muted, marginTop: 1 },

  sectionLabel: {
    ...typography.label, color: colors.muted,
    marginBottom: 8, textTransform: 'uppercase',
  },

  // Champ prénom
  inputBox: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.xl, paddingVertical: 14,
  },
  input: {
    fontFamily: fonts.semiBold, fontSize: 18, fontWeight: '600', color: colors.text,
  },

  // Sélecteur objectif
  card: {
    backgroundColor: colors.card, borderRadius: 16,
    padding: spacing.xl, alignItems: 'center',
  },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  adjBtn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: colors.card2,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  adjBtnPlus: { backgroundColor: colors.accent, borderColor: colors.accent },
  adjBtnText: { color: colors.text, fontSize: 24, lineHeight: Platform.OS === 'android' ? 30 : 24 },
  goalValueBox: { alignItems: 'center', minWidth: 110 },
  goalValue: {
    fontFamily: fonts.extraBold, fontSize: 44, fontWeight: '900',
    color: colors.text, lineHeight: 48,
  },
  goalUnit: { ...typography.caption, color: colors.muted, marginTop: 2 },

  // Bouton
  saveBtn: {
    marginTop: 32, paddingVertical: 17, borderRadius: 16,
    backgroundColor: colors.accent, alignItems: 'center',
    shadowColor: colors.accent, shadowOpacity: 0.38,
    shadowRadius: 11, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  saveBtnSuccess: { backgroundColor: colors.success },
  saveBtnText: {
    fontFamily: fonts.extraBold, fontSize: 16, fontWeight: '800',
    color: 'white', letterSpacing: 0.2,
  },
});
