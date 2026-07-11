import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity,
  TextInput, StyleSheet, Platform, Alert,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconClock, IconCircleCheck } from '@tabler/icons-react-native';
import { RootStackParamList, TabParamList } from '../navigation/AppNavigator';
import { saveBottle, updateBottle, Bottle } from "../storage/bottleStorage";
import { Stepper } from '../components/Stepper';
import { Button } from '../components/Button';
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { radius } from "../theme/radius";
import { typography, fonts } from "../theme/typography";

// ── Types ──────────────────────────────────────────────────────────────────────
type AddBottleNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Ajout'>,
  StackNavigationProp<RootStackParamList>
>;
type AddBottleRoute = { params?: { bottle?: Bottle } };

const CHIPS = [60, 90, 120, 150, 180, 210];

function fmt(d: Date) {
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function AddBottleScreen({ navigation, route }: { navigation: AddBottleNavigationProp; route: AddBottleRoute }) {
  const bottle: Bottle | undefined = route?.params?.bottle;
  const isEditing = Boolean(bottle);

  const [qty,          setQty]          = useState(bottle ? bottle.quantity : 120);
  const [time,         setTime]         = useState(() => bottle ? fmt(new Date(bottle.timestamp)) : fmt(new Date()));
  const [note,         setNote]         = useState(bottle ? bottle.notes : '');
  const [saved,        setSaved]        = useState(false);
  const [showPicker,   setShowPicker]   = useState(false);
  const [selectedTime, setSelectedTime] = useState(() => bottle ? new Date(bottle.timestamp) : new Date());

  const editTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addTimeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (addTimeoutRef.current) clearTimeout(addTimeoutRef.current);
    };
  }, []);

  function setNow() { setTime(fmt(new Date())); }

  async function handleSave() {
    try {
      const [hStr, mStr] = time.replace('h', ':').split(':');
      if (isEditing && bottle) {
        // Préserve la date d'origine, met à jour l'heure uniquement
        const orig = new Date(bottle.timestamp);
        const editedDate = new Date(
          orig.getFullYear(), orig.getMonth(), orig.getDate(),
          Number(hStr), Number(mStr),
        );
        await updateBottle(bottle.id, qty, editedDate.toISOString(), note);
        setSaved(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        editTimeoutRef.current = setTimeout(() => { setSaved(false); navigation.goBack(); }, 950);
      } else {
        const n = new Date();
        const date = new Date(n.getFullYear(), n.getMonth(), n.getDate(), Number(hStr), Number(mStr));
        await saveBottle(String(qty), date, note);
        setSaved(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        addTimeoutRef.current = setTimeout(() => {
          setSaved(false);
          setQty(120);
          setNote('');
          setNow();
        }, 950);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le biberon. Réessaie.');
    }
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardOpeningTime={0}
    >
      {/* ── Header ── */}
      <View style={s.headerRow}>
        <View>
          <Text style={s.headerTitle}>{isEditing ? 'Modifier le biberon' : 'Nouveau biberon'}</Text>
          <Text style={s.headerSub}>{isEditing ? 'Mise à jour' : 'Ajout rapide'}</Text>
        </View>
      </View>

      {/* ── Sélecteur quantité ── */}
      <View style={s.card}>
        <Stepper
          value={qty}
          onDecrement={() => setQty(q => Math.max(10, q - 10))}
          onIncrement={() => setQty(q => q + 10)}
        />
        <Text style={s.mlLabel}>ml</Text>
      </View>

      {/* ── Chips rapides ── */}
      <View style={s.chips}>
        {CHIPS.map(v => (
          <TouchableOpacity
            key={v}
            onPress={() => setQty(v)}
            style={[s.chip, qty === v && s.chipActive]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Sélectionner ${v} ml`}
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
          <IconClock size={16} color={colors.muted} />
          <Text style={s.fieldValue}>{time}</Text>
          <TouchableOpacity
            onPress={setNow}
            style={s.nowBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Définir l'heure maintenant"
          >
            <Text style={s.nowBtnText}>Maintenant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={s.pickBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Choisir l'heure"
          >
            <Text style={s.pickBtnText}>Choisir</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowPicker(Platform.OS === 'ios');
            if (date) {
              setSelectedTime(date);
              setTime(fmt(date));
            }
          }}
        />
      )}

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
      <Button
        success={saved}
        onPress={handleSave}
        style={s.saveBtn}
        accessibilityLabel={isEditing ? 'Modifier le biberon' : 'Enregistrer le biberon'}
      >
        {saved ? (
          <View style={s.saveBtnSuccessRow}>
            <IconCircleCheck size={18} color={colors.textOnAccent} />
            <Text style={s.saveBtnText}>Enregistré !</Text>
          </View>
        ) : (
          isEditing ? 'Modifier' : 'Enregistrer'
        )}
      </Button>
    </KeyboardAwareScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 120 },

  // Header
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingTop: 6, marginBottom: 24,
  },
  headerTitle: { fontFamily: fonts.extraBold, fontSize: 20, fontWeight: '800', color: colors.text },
  headerSub:   { ...typography.small, color: colors.muted, marginTop: 1 },

  // Qty selector
  card: {
    backgroundColor: colors.card, borderRadius: radius.md,
    paddingVertical: 28, paddingHorizontal: spacing.xl,
    marginBottom: 16, alignItems: 'center',
  },
  mlLabel: { ...typography.body, color: colors.muted, marginTop: 10 },

  // Chips
  chips: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.sm, marginBottom: 22, justifyContent: 'center',
  },
  chip: {
    paddingVertical: 8, paddingHorizontal: 15, borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
  },
  chipActive:     { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText:       { ...typography.small, fontWeight: '700', color: colors.muted },
  chipTextActive: { ...typography.small, fontWeight: '700', color: colors.textOnAccent },

  // Fields
  fieldBlock: { marginBottom: 14 },
  fieldLabel: {
    ...typography.label, color: colors.muted,
    marginBottom: 8, textTransform: 'uppercase',
  },
  optional: { textTransform: 'none', fontWeight: '500', opacity: 0.65 },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radius.md,
    padding: 13, paddingHorizontal: 14, gap: 10,
  },
  fieldValue: { flex: 1, ...typography.body, color: colors.text },
  nowBtn: {
    backgroundColor: colors.accent, borderRadius: radius.pill,
    paddingVertical: 6, paddingHorizontal: 14,
  },
  nowBtnText: { ...typography.small, color: colors.textOnAccent, fontWeight: '700' },
  pickBtn: {
    backgroundColor: colors.card2, borderRadius: radius.pill,
    paddingVertical: 6, paddingHorizontal: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  pickBtnText: { ...typography.small, color: colors.text, fontWeight: '700' },

  // Notes
  notesBox: {
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 13, paddingHorizontal: 14,
  },
  notesInput: {
    color: colors.text, fontSize: 14,
    minHeight: 72, textAlignVertical: 'top',
  },

  // Save button
  saveBtn: { marginTop: 12 },
  saveBtnSuccessRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveBtnText: { fontFamily: fonts.extraBold, fontSize: 16, fontWeight: '800', color: colors.textOnAccent, letterSpacing: 0.2 },
});
