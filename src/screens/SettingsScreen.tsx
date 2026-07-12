import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { IconChevronLeft, IconDownload, IconCircleCheck } from '@tabler/icons-react-native';
import { getSettings, saveSettings } from "../storage/settingsStorage";
import { getBottles } from "../storage/bottleStorage";
import { exportBottlesToCSV } from "../utils/exportUtils";
import { shareCSV } from "../utils/shareUtils";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Stepper } from '../components/Stepper';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import { Card } from '../components/Card';
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography, fonts } from "../theme/typography";

type SettingsNavigationProp = StackNavigationProp<RootStackParamList, 'Paramètres'>;

export default function SettingsScreen({ navigation }: { navigation: SettingsNavigationProp }) {
  const [childName,   setChildName]   = useState('');
  const [dailyGoal,   setDailyGoal]   = useState(800);
  const [saved,       setSaved]       = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    getSettings().then(s => {
      setChildName(s.childName);
      setDailyGoal(s.dailyGoal);
    });
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const bottles = await getBottles();
      const csv     = exportBottlesToCSV(bottles);
      await shareCSV(csv, childName || 'bébé');
    } catch {
      Alert.alert('Erreur', 'Impossible d\'exporter les données.');
    } finally {
      setIsExporting(false);
    }
  };

  async function handleSave() {
    await saveSettings({ childName: childName.trim() || 'bébé', dailyGoal });
    setSaved(true);
    saveTimeoutRef.current = setTimeout(() => {
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
          <IconButton size="sm" onPress={() => navigation.goBack()} accessibilityLabel="Retour">
            <IconChevronLeft size={20} color={colors.text} />
          </IconButton>
          <View>
            <Text style={s.headerTitle}>Paramètres</Text>
            <Text style={s.headerSub}>Configurer l'application</Text>
          </View>
        </View>

        {/* ── Prénom ── */}
        <Text style={s.sectionLabel}>PRÉNOM DE BÉBÉ</Text>
        <Card style={s.inputBox}>
          <TextInput
            style={s.input}
            value={childName}
            onChangeText={setChildName}
            placeholder="Prénom de bébé"
            placeholderTextColor={colors.muted}
            autoCapitalize="words"
          />
        </Card>

        {/* ── Objectif journalier ── */}
        <Text style={[s.sectionLabel, { marginTop: 24 }]}>OBJECTIF JOURNALIER</Text>
        <Card style={s.card}>
          <Stepper
            value={dailyGoal}
            unit="ml / jour"
            size="md"
            onDecrement={() => setDailyGoal(g => Math.max(200, g - 50))}
            onIncrement={() => setDailyGoal(g => g + 50)}
          />
        </Card>

        {/* ── Bouton Enregistrer ── */}
        <Button
          success={saved}
          onPress={handleSave}
          style={s.saveBtn}
          accessibilityLabel="Enregistrer les paramètres"
        >
          {saved ? (
            <View style={s.saveBtnSuccessRow}>
              <IconCircleCheck size={18} color={colors.textOnAccent} />
              <Text style={s.saveBtnText}>Enregistré !</Text>
            </View>
          ) : 'Enregistrer'}
        </Button>

        {/* ── Données ── */}
        <Text style={[s.sectionLabel, { marginTop: 36 }]}>DONNÉES</Text>
        <TouchableOpacity
          onPress={handleExport}
          disabled={isExporting}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Exporter les données au format CSV"
        >
          <Card style={[s.exportRow, isExporting && s.exportRowDisabled]}>
            {isExporting ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <IconDownload size={22} color={colors.accent} />
            )}
            <View style={s.exportTextCol}>
              <Text style={s.exportLabel}>Exporter les données</Text>
              <Text style={s.exportSub}>Historique complet au format CSV</Text>
            </View>
          </Card>
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
  headerTitle: { fontFamily: fonts.extraBold, fontSize: 20, fontWeight: '800', color: colors.text },
  headerSub:   { ...typography.small, color: colors.muted, marginTop: 1 },

  sectionLabel: {
    ...typography.label, color: colors.muted,
    marginBottom: 8, textTransform: 'uppercase',
  },

  // Champ prénom
  inputBox: {
    paddingHorizontal: spacing.xl, paddingVertical: 14,
  },
  input: {
    fontFamily: fonts.semiBold, fontSize: 18, fontWeight: '600', color: colors.text,
  },

  // Sélecteur objectif
  card: {
    alignItems: 'center',
  },

  // Export
  exportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  exportRowDisabled: { opacity: 0.5 },
  exportTextCol: { flex: 1 },
  exportLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  exportSub: {
    ...typography.small,
    color: colors.muted,
    marginTop: 2,
  },

  // Bouton
  saveBtn: { marginTop: 32 },
  saveBtnSuccessRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveBtnText: {
    fontFamily: fonts.extraBold, fontSize: 16, fontWeight: '800',
    color: colors.textOnAccent, letterSpacing: 0.2,
  },
});
