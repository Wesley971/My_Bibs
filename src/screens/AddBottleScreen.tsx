import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring,
} from "react-native-reanimated";
import { saveBottle } from "../storage/bottleStorage";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography, fonts } from "../theme/typography";

const CHIPS = [60, 90, 120, 150, 180, 210];

function fmt(d: Date) {
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function AddBottleScreen({ navigation }: any) {
  const [qty,   setQty]  = useState(120);
  const [time,  setTime] = useState(() => fmt(new Date()));
  const [note,  setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const saveScale    = useSharedValue(1);
  const saveAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  function setNow() { setTime(fmt(new Date())); }

  async function handleSave() {
    try {
      const [hStr, mStr] = time.replace('h', ':').split(':');
      const n = new Date();
      const date = new Date(n.getFullYear(), n.getMonth(), n.getDate(), Number(hStr), Number(mStr));
      await saveBottle(String(qty), date, note);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setQty(120);
        setNote('');
        setNow();
      }, 950);
    } catch { /* ignore */ }
  }

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Header ── */}
      <View style={s.headerRow}>
        <View>
          <Text style={s.headerTitle}>Nouveau biberon</Text>
          <Text style={s.headerSub}>Ajout rapide</Text>
        </View>
      </View>

      {/* ── Sélecteur quantité ── */}
      <View style={s.card}>
        <View style={s.qtyRow}>
          <TouchableOpacity
            onPress={() => setQty(q => Math.max(10, q - 10))}
            style={s.btnMinus}
          >
            <Text style={s.btnMinusText}>−</Text>
          </TouchableOpacity>

          <Text style={s.qtyNum}>{qty}</Text>

          <TouchableOpacity
            onPress={() => setQty(q => q + 10)}
            style={s.btnPlus}
          >
            <Text style={s.btnPlusText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.mlLabel}>ml</Text>
      </View>

      {/* ── Chips rapides ── */}
      <View style={s.chips}>
        {CHIPS.map(v => (
          <TouchableOpacity
            key={v}
            onPress={() => setQty(v)}
            style={[s.chip, qty === v && s.chipActive]}
          >
            <Text style={[s.chipText, qty === v && s.chipTextActive]}>
              {v} ml
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Heure ── */}
      <View style={s.fieldBlock}>
        <Text style={s.fieldLabel}>HEURE</Text>
        <View style={s.fieldRow}>
          <Text style={s.clockIcon}>◷</Text>
          <Text style={s.fieldValue}>{time}</Text>
          <TouchableOpacity onPress={setNow} style={s.nowBtn}>
            <Text style={s.nowBtnText}>Maintenant</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Note ── */}
      <View style={s.fieldBlock}>
        <Text style={s.fieldLabel}>
          NOTE <Text style={s.optional}>· optionnel</Text>
        </Text>
        <View style={s.notesBox}>
          <TextInput
            style={s.notesInput}
            multiline
            numberOfLines={3}
            value={note}
            onChangeText={setNote}
            placeholder="Ex : a bien tété, un peu agité..."
            placeholderTextColor={colors.muted}
          />
        </View>
      </View>

      {/* ── Bouton Enregistrer ── */}
      <Animated.View style={saveAnimStyle}>
        <TouchableOpacity
          onPress={handleSave}
          onPressIn={() => { saveScale.value = withSpring(0.95); }}
          onPressOut={() => { saveScale.value = withSpring(1.0); }}
          style={[s.saveBtn, saved && s.saveBtnSuccess]}
          activeOpacity={0.85}
        >
          <Text style={s.saveBtnText}>
            {saved ? '✓  Enregistré !' : 'Enregistrer'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: 'transparent' },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },

  // Header
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingTop: 6, marginBottom: 24,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon:    { color: colors.text, fontSize: 24, lineHeight: 30, marginTop: -2 },
  headerTitle: { fontFamily: fonts.extraBold, fontSize: 20, fontWeight: '800', color: colors.text },
  headerSub:   { ...typography.caption, color: colors.muted, marginTop: 1 },

  // Qty selector
  card: {
    backgroundColor: colors.card, borderRadius: 16,
    paddingVertical: 28, paddingHorizontal: spacing.xl,
    marginBottom: 16, alignItems: 'center',
  },
  qtyRow:      { flexDirection: 'row', alignItems: 'center', gap: 28, marginBottom: 10 },
  qtyNum:      { fontFamily: fonts.extraBold, fontSize: 64, fontWeight: '900', color: colors.text, minWidth: 115, textAlign: 'center', lineHeight: 64 },
  btnMinus: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: colors.card2,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  btnMinusText: { color: colors.text, fontSize: 28, lineHeight: Platform.OS === 'android' ? 32 : 28 },
  btnPlus: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.accent, shadowOpacity: 0.5,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  btnPlusText: { color: 'white', fontSize: 28, lineHeight: Platform.OS === 'android' ? 32 : 28 },
  mlLabel:     { ...typography.bodyS, color: colors.muted },

  // Chips
  chips: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.sm, marginBottom: 22, justifyContent: 'center',
  },
  chip: {
    paddingVertical: 8, paddingHorizontal: 15, borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
  },
  chipActive:     { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText:       { ...typography.chip, color: colors.muted },
  chipTextActive: { ...typography.chip, color: 'white' },

  // Fields
  fieldBlock: { marginBottom: 14 },
  fieldLabel: {
    ...typography.label, color: colors.muted,
    marginBottom: 8, textTransform: 'uppercase',
  },
  optional: { textTransform: 'none', fontWeight: '500', opacity: 0.65 },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 12,
    padding: 13, paddingHorizontal: 14, gap: 10,
  },
  clockIcon:  { fontSize: 16, color: colors.muted },
  fieldValue: { flex: 1, ...typography.body, color: colors.text },
  nowBtn: {
    backgroundColor: colors.accent, borderRadius: 99,
    paddingVertical: 6, paddingHorizontal: 14,
  },
  nowBtnText: { ...typography.caption, color: 'white', fontWeight: '700' },

  // Notes
  notesBox: {
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 13, paddingHorizontal: 14,
  },
  notesInput: {
    color: colors.text, fontSize: 14,
    minHeight: 72, textAlignVertical: 'top',
  },

  // Save button
  saveBtn: {
    marginTop: 12, paddingVertical: 17, borderRadius: 16,
    backgroundColor: colors.accent, alignItems: 'center',
    shadowColor: colors.accent, shadowOpacity: 0.38,
    shadowRadius: 11, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  saveBtnSuccess: { backgroundColor: colors.success },
  saveBtnText:    { fontFamily: fonts.extraBold, fontSize: 16, fontWeight: '800', color: 'white', letterSpacing: 0.2 },
});
