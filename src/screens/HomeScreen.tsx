import React, { useCallback, useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle, useSharedValue, withDelay, withTiming,
} from "react-native-reanimated";
import { useFocusEffect, CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconSettings, IconBabyBottle } from '@tabler/icons-react-native';
import { RootStackParamList, TabParamList } from '../navigation/AppNavigator';
import { useBottlesForToday } from '../hooks/useBottlesForToday';
import { SkeletonRow } from '../components/SkeletonRow';
import { Card } from '../components/Card';
import { QtyBadge } from '../components/QtyBadge';
import { Bottle } from "../storage/bottleStorage";
import { getSettings, Settings } from "../storage/settingsStorage";
import { DAILY_GOAL_DEFAULT } from "../config/constants";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography, fonts } from "../theme/typography";

// ── Constantes ─────────────────────────────────────────────────────────────────
const DAY_NAMES   = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const MONTH_NAMES = [
  'janvier','février','mars','avril','mai','juin',
  'juillet','août','septembre','octobre','novembre','décembre',
];

// ── Types ──────────────────────────────────────────────────────────────────────
type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Accueil'>,
  StackNavigationProp<RootStackParamList>
>;

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeStr(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`;
}

// ── HomeBibRow — FadeIn + slideUp avec délai progressif ───────────────────────
const HomeBibRow = React.memo(function HomeBibRow({ item, index, triggerKey }: { item: Bottle; index: number; triggerKey: number }) {
  const opacity    = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    opacity.value    = 0;
    translateY.value = 20;
    const delay = Math.min(index, 5) * 60;
    opacity.value    = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 300 }));
  }, [triggerKey]);

  return (
    <Animated.View style={animStyle}>
      <View style={s.bibRow}>
        <Text style={s.bibTime}>{timeStr(item.timestamp)}</Text>
        <IconBabyBottle size={15} color={colors.muted} />
        <Text style={s.bibName}>Biberon</Text>
        <QtyBadge qty={item.quantity} />
      </View>
    </Animated.View>
  );
});

// ── Écran ──────────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }: { navigation: HomeNavigationProp }) {
  const { bottles, focusKey } = useBottlesForToday();
  const [settings, setSettings] = useState<Settings>({
    childName: 'bébé', dailyGoal: DAILY_GOAL_DEFAULT, isOnboardingDone: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const cardOpacity   = useSharedValue(0);
  const cardAnimStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value }));

  // Anime la card une seule fois au montage initial
  useEffect(() => {
    cardOpacity.value = withDelay(150, withTiming(1, { duration: 400 }));
  }, []);

  // Recharge les settings à chaque focus
  useFocusEffect(useCallback(() => {
    setIsLoading(true);
    getSettings()
      .then(setSettings)
      .finally(() => setIsLoading(false));
  }, []));

  // ── Calculs ──
  const total    = bottles.reduce((sum, b) => sum + b.quantity, 0);
  const pct      = Math.min(100, Math.round((total / settings.dailyGoal) * 100));
  const lastTime = bottles[0] ? timeStr(bottles[0].timestamp) : '--';

  // ── Salutation contextuelle ──
  const now  = new Date();
  const h    = now.getHours();
  const name = settings.childName || 'bébé';
  const greet    = h < 6 || h >= 21 ? 'Bonne nuit,' : h < 12 ? 'Bonjour,' : 'Bon après-midi,';
  const subtitle = h < 6 || h >= 21
    ? 'Tout se passe bien, dors tranquille ✨'
    : `Tout va bien, ${name} est en pleine forme ✨`;
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
          <View style={s.headerTopRow}>
            <Text style={s.dateLabel}>{dateStr}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Paramètres')}
              style={s.settingsBtn}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Ouvrir les paramètres"
            >
              <IconSettings size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>
          <Text style={s.greet}>{greet}</Text>
          <Text style={s.name}>{name}</Text>
          <Text style={s.subtitle}>{subtitle}</Text>
        </View>

        {/* ── Carte Total du jour ── */}
        <Animated.View style={cardAnimStyle}>
          <Card style={s.card}>
            <Text style={s.sectionLabel}>TOTAL DU JOUR</Text>

            <View style={s.totalRow}>
              <View style={s.totalLeft}>
                <Text style={s.totalNum}>{total}</Text>
                <Text style={s.totalUnit}>ml</Text>
              </View>
              <View style={s.goalBox}>
                <Text style={s.goalLabel}>Objectif</Text>
                <Text style={s.goalNum}>{settings.dailyGoal} ml</Text>
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
          </Card>
        </Animated.View>

        {/* ── Biberons du jour ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Biberons du jour</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Historique')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Voir tout l'historique"
            >
              <Text style={s.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : bottles.length === 0 ? (
            <Text style={s.empty}>Aucun biberon enregistré aujourd'hui.</Text>
          ) : (
            bottles.map((b, idx) => (
              <HomeBibRow key={b.id} item={b} index={idx} triggerKey={focusKey} />
            ))
          )}
        </View>
      </ScrollView>

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
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  settingsBtn:  { padding: 10 },
  dateLabel:{ ...typography.small, color: colors.muted },
  greet:    { ...typography.small, color: colors.muted, fontWeight: '500' },
  name:     { ...typography.h1, color: colors.text, marginTop: 1 },
  subtitle: { ...typography.small, color: colors.muted, marginTop: 4 },

  // Carte total
  card: { marginHorizontal: spacing.lg, marginBottom: 22 },
  sectionLabel: {
    ...typography.label,
    color: colors.muted,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  totalRow:  { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 },
  totalLeft: { flexDirection: 'row', alignItems: 'flex-end', gap: 7 },
  totalNum:  { ...typography.display, color: colors.text },
  totalUnit: { fontFamily: fonts.bold, fontSize: 15, fontWeight: '700', color: colors.acL, paddingBottom: 4 },
  goalBox:   { alignItems: 'flex-end', paddingBottom: 4 },
  goalLabel: { ...typography.label, color: colors.muted, marginBottom: 2 },
  goalNum:   { ...typography.body, color: colors.text, fontWeight: '700' },

  progressBg:   { backgroundColor: colors.progressBg, borderRadius: 99, height: 6, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', borderRadius: 99, backgroundColor: colors.accent },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  mutedText:    { ...typography.small, color: colors.muted },
  pctText:      { ...typography.small, fontWeight: '700', color: colors.acL },

  // Section biberons
  section:       { paddingHorizontal: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:  { ...typography.h2, color: colors.text },
  seeAll:        { ...typography.small, color: colors.accent, fontWeight: '700' },

  bibRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card,
    borderRadius: 12, padding: 13, paddingHorizontal: 14,
    marginBottom: 8,
  },
  bibTime:    { ...typography.small, color: colors.muted, minWidth: 42 },
  bibName:    { fontFamily: fonts.semiBold, flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },

  empty:  { ...typography.body, color: colors.muted, textAlign: 'center', marginTop: 24 },
});
