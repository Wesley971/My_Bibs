import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState, View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle, useSharedValue, withDelay, withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { getBottles } from "../storage/bottleStorage";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography, fonts } from "../theme/typography";

// ── Constantes ─────────────────────────────────────────────────────────────────
const DAILY_GOAL = 800;
const DAY_NAMES   = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const MONTH_NAMES = [
  'janvier','février','mars','avril','mai','juin',
  'juillet','août','septembre','octobre','novembre','décembre',
];

// ── Types ──────────────────────────────────────────────────────────────────────
type Bottle = { id: string; quantity: number; timestamp: string; notes: string };

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeStr(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`;
}

// ── QtyBadge ───────────────────────────────────────────────────────────────────
function QtyBadge({ qty }: { qty: number }) {
  const good = qty >= 130, low = qty <= 75;
  const bg  = good ? colors.goodBg  : low ? colors.lowBg  : 'rgba(167,139,250,0.18)';
  const bdr = good ? colors.goodBdr : low ? colors.lowBdr : 'rgba(167,139,250,0.35)';
  const col = good ? colors.goodText: low ? colors.lowText: colors.acL;
  return (
    <View style={[s.badge, { backgroundColor: bg, borderColor: bdr }]}>
      <Text style={[s.badgeText, { color: col }]}>{qty} ml</Text>
    </View>
  );
}

// ── HomeBibRow — FadeIn + slideUp avec délai progressif ───────────────────────
function HomeBibRow({ item, index, triggerKey }: { item: Bottle; index: number; triggerKey: number }) {
  const opacity    = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    opacity.value    = 0;
    translateY.value = 20;
    const delay = index * 60;
    opacity.value    = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 300 }));
  }, [triggerKey]);

  return (
    <Animated.View style={animStyle}>
      <View style={s.bibRow}>
        <Text style={s.bibTime}>{timeStr(item.timestamp)}</Text>
        <Text style={s.bottleIcon}>🍼</Text>
        <Text style={s.bibName}>Biberon</Text>
        <QtyBadge qty={item.quantity} />
        <Text style={s.chevron}>›</Text>
      </View>
    </Animated.View>
  );
}

// ── Écran ──────────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }: any) {
  const [bottles,  setBottles]  = useState<Bottle[]>([]);
  const [focusKey, setFocusKey] = useState(0);

  const cardOpacity   = useSharedValue(0);
  const cardAnimStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value }));
  const currentDayRef = useRef(new Date().toDateString());

  const loadBottles = useCallback(() => {
    getBottles().then(all => {
      const todayStr = new Date().toDateString();
      const today = all
        .filter(b => new Date(b.timestamp).toDateString() === todayStr)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setBottles(today);
      setFocusKey(k => k + 1);
    });
  }, []);

  // Anime la card une seule fois au montage initial
  useEffect(() => {
    cardOpacity.value = withDelay(150, withTiming(1, { duration: 400 }));
  }, []);

  // Recharge les données + déclenche l'animation des items à chaque focus
  useFocusEffect(useCallback(() => {
    loadBottles();
  }, [loadBottles]));

  // Mécanisme 1 — refresh automatique à minuit exact
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNextMidnight() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = midnight.getTime() - now.getTime();

      timeoutId = setTimeout(() => {
        loadBottles();
        scheduleNextMidnight();
      }, msUntilMidnight);
    }

    scheduleNextMidnight();
    return () => clearTimeout(timeoutId);
  }, [loadBottles]);

  // Mécanisme 2 — refresh si l'app revient au premier plan un jour différent
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        const today = new Date().toDateString();
        if (today !== currentDayRef.current) {
          currentDayRef.current = today;
          loadBottles();
        }
      }
    });

    return () => subscription.remove();
  }, [loadBottles]);

  // ── Calculs ──
  const total    = bottles.reduce((sum, b) => sum + b.quantity, 0);
  const pct      = Math.min(100, Math.round((total / DAILY_GOAL) * 100));
  const lastTime = bottles[0] ? timeStr(bottles[0].timestamp) : '--';

  // ── Salutation contextuelle ──
  const now = new Date();
  const h   = now.getHours();
  const greet    = h < 6 || h >= 21 ? 'Bonne nuit,' : h < 12 ? 'Bonjour,' : 'Bon après-midi,';
  const subtitle = h < 6 || h >= 21
    ? 'Tout se passe bien, dors tranquille ✨'
    : 'Tout va bien, Leo est en pleine forme ✨';
  const dateStr  =
    `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.dateLabel}>{dateStr}</Text>
          <Text style={s.greet}>{greet}</Text>
          <Text style={s.name}>Leo</Text>
          <Text style={s.subtitle}>{subtitle}</Text>
        </View>

        {/* ── Carte Total du jour ── */}
        <Animated.View style={[s.card, cardAnimStyle]}>
          <Text style={s.sectionLabel}>TOTAL DU JOUR</Text>

          <View style={s.totalRow}>
            <View style={s.totalLeft}>
              <Text style={s.totalNum}>{total}</Text>
              <Text style={s.totalUnit}>ml</Text>
            </View>
            <View style={s.goalBox}>
              <Text style={s.goalLabel}>Objectif</Text>
              <Text style={s.goalNum}>{DAILY_GOAL} ml</Text>
            </View>
          </View>

          {/* Barre de progression */}
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${pct}%` as any }]} />
          </View>

          <View style={s.progressMeta}>
            <Text style={s.mutedText}>
              {bottles.length} biberon{bottles.length > 1 ? 's' : ''} · Dernier : {lastTime}
            </Text>
            <Text style={s.pctText}>{pct} %</Text>
          </View>
        </Animated.View>

        {/* ── Biberons du jour ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Biberons du jour</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Historique')}>
              <Text style={s.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          {bottles.length === 0 ? (
            <Text style={s.empty}>Aucun biberon enregistré aujourd'hui.</Text>
          ) : (
            bottles.map((b, idx) => (
              <HomeBibRow key={b.id} item={b} index={idx} triggerKey={focusKey} />
            ))
          )}
        </View>
      </ScrollView>

      {/* ── FAB + ── */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate('Ajout')}
        activeOpacity={0.85}
      >
        <Text style={s.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: 'transparent' },
  scroll:  { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 100 },

  // Header
  header:   { padding: spacing.lg, paddingBottom: spacing.xl },
  dateLabel:{ ...typography.caption, color: colors.muted, marginBottom: 5 },
  greet:    { ...typography.caption, color: colors.muted, fontWeight: '500' },
  name:     { fontFamily: fonts.extraBold, fontSize: 40, fontWeight: '900', color: colors.text, lineHeight: 44, letterSpacing: -0.5, marginTop: 1 },
  subtitle: { ...typography.small, color: colors.muted, marginTop: 4 },

  // Carte total
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: 22,
    padding: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: 16,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.muted,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  totalRow:  { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 },
  totalLeft: { flexDirection: 'row', alignItems: 'flex-end', gap: 7 },
  totalNum:  { fontFamily: fonts.extraBold, fontSize: 56, fontWeight: '900', color: colors.text, lineHeight: 56 },
  totalUnit: { fontFamily: fonts.bold,      fontSize: 19, fontWeight: '700', color: colors.acL, paddingBottom: 4 },
  goalBox:   { alignItems: 'flex-end', paddingBottom: 4 },
  goalLabel: { ...typography.label, color: colors.muted, marginBottom: 2 },
  goalNum:   { fontFamily: fonts.extraBold, fontSize: 17, fontWeight: '800', color: colors.text },

  progressBg:   { backgroundColor: 'rgba(167,139,250,0.12)', borderRadius: 99, height: 6, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', borderRadius: 99, backgroundColor: colors.accent },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  mutedText:    { ...typography.caption, color: colors.muted },
  pctText:      { ...typography.caption, fontWeight: '700', color: colors.acL },

  // Section biberons
  section:       { paddingHorizontal: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:  { fontFamily: fonts.extraBold, fontSize: 17, fontWeight: '800', color: colors.text },
  seeAll:        { ...typography.small, color: colors.accent, fontWeight: '700' },

  bibRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card,
    borderRadius: 12, padding: 13, paddingHorizontal: 14,
    marginBottom: 8,
  },
  bibTime:    { ...typography.small, color: colors.muted, minWidth: 42 },
  bottleIcon: { fontSize: 16 },
  bibName:    { fontFamily: fonts.semiBold, flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  chevron:    { fontSize: 18, color: colors.muted },

  empty: { ...typography.body, color: colors.muted, textAlign: 'center', marginTop: 24 },

  // Badge quantité
  badge:     { borderWidth: 1, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 10 },
  badgeText: { fontFamily: fonts.bold, fontSize: 12, fontWeight: '700' },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 90, right: 20,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.55, shadowRadius: 11,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabIcon: { color: 'white', fontSize: 28, lineHeight: 32, marginTop: -2 },
});
