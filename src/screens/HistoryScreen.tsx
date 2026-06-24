import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet, SectionList, View, Text, TouchableOpacity, Alert,
} from "react-native";
import Animated, {
  useAnimatedStyle, useSharedValue, withDelay, withTiming,
} from "react-native-reanimated";
import { Swipeable } from "react-native-gesture-handler";
import { useFocusEffect, CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, TabParamList } from '../navigation/AppNavigator';
import { getBottles, deleteBottle, Bottle } from "../storage/bottleStorage";
import { getSettings } from "../storage/settingsStorage";
import { DAILY_GOAL_DEFAULT, BADGE_GREEN_MIN, BADGE_ORANGE_MAX } from "../config/constants";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography, fonts } from "../theme/typography";
import { SkeletonRow } from '../components/SkeletonRow';

// ── Types ──────────────────────────────────────────────────────────────────────
type DaySection = { title: string; total: number; pct: number; data: Bottle[] };
type HistoryNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Historique'>,
  StackNavigationProp<RootStackParamList>
>;

// ── Constantes ─────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'janvier','février','mars','avril','mai','juin',
  'juillet','août','septembre','octobre','novembre','décembre',
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function dayLabel(dateStr: string): string {
  const d     = new Date(dateStr);
  const today = new Date().toDateString();
  const yest  = new Date(Date.now() - 86400000).toDateString();
  if (d.toDateString() === today) return `Aujourd'hui · ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  if (d.toDateString() === yest)  return `Hier · ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function groupByDay(bottles: Bottle[], dailyGoal: number): DaySection[] {
  const map = new Map<string, Bottle[]>();
  for (const b of bottles) {
    const key = new Date(b.timestamp).toDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(b);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([key, bibs]) => {
      bibs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const total = bibs.reduce((s, b) => s + b.quantity, 0);
      const pct   = Math.min(100, Math.round((total / dailyGoal) * 100));
      return { title: dayLabel(key), total, pct, data: bibs };
    });
}

function timeStr(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`;
}

// ── QtyBadge ───────────────────────────────────────────────────────────────────
function QtyBadge({ qty }: { qty: number }) {
  const good = qty >= BADGE_GREEN_MIN, low = qty <= BADGE_ORANGE_MAX;
  const bg   = good ? colors.goodBg  : low ? colors.lowBg  : colors.border;
  const bdr  = good ? colors.goodBdr : low ? colors.lowBdr : colors.accentBdr;
  const col  = good ? colors.goodText: low ? colors.lowText: colors.acL;
  return (
    <View style={[s.badge, { backgroundColor: bg, borderColor: bdr }]}>
      <Text style={[s.badgeText, { color: col }]}>{qty} ml</Text>
    </View>
  );
}

// ── BibRow avec Swipeable ──────────────────────────────────────────────────────
const BibRow = React.memo(function BibRow({ item, onDelete, onPress, index }: { item: Bottle; onDelete: (id: string) => void; onPress: (bottle: Bottle) => void; index: number }) {
  const swipeRef   = useRef<Swipeable>(null);
  const opacity    = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = Math.min(index, 5) * 60;
    opacity.value    = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 300 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const renderRightActions = () => (
    <TouchableOpacity
      style={s.deleteAction}
      onPress={() => {
        swipeRef.current?.close();
        Alert.alert(
          'Supprimer ce biberon ?',
          'Cette action est irréversible.',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Supprimer', style: 'destructive', onPress: () => onDelete(item.id) },
          ]
        );
      }}
      accessibilityRole="button"
      accessibilityLabel="Supprimer ce biberon"
    >
      <Text style={s.deleteActionIcon}>🗑</Text>
      <Text style={s.deleteActionText}>Suppr.</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View
      style={animStyle}
      accessibilityActions={[{ name: 'delete', label: 'Supprimer ce biberon' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'delete') {
          onDelete(item.id);
        }
      }}
    >
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
      >
        <TouchableOpacity
          style={s.bibRow}
          onPress={() => onPress(item)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Modifier ce biberon"
        >
          <Text style={s.bibTime}>{timeStr(item.timestamp)}</Text>
          <Text style={s.bottleIcon}>🍼</Text>
          <View style={s.bibInfo}>
            <Text style={s.bibName}>Biberon</Text>
            {item.notes ? <Text style={s.bibNote}>{item.notes}</Text> : null}
          </View>
          <QtyBadge qty={item.quantity} />
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
});

// ── Écran ──────────────────────────────────────────────────────────────────────
export default function HistoryScreen({ navigation }: { navigation: HistoryNavigationProp }) {
  const [sections, setSections] = useState<DaySection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current); };
  }, []);

  const toastOpacity = useSharedValue(0);
  const toastAnimStyle = useAnimatedStyle(() => ({ opacity: toastOpacity.value }));
  useEffect(() => {
    toastOpacity.value = withTiming(toastVisible ? 1 : 0, { duration: 200 });
  }, [toastVisible]);

  const reload = useCallback(() => {
    setIsLoading(true);
    Promise.all([getBottles(), getSettings()]).then(([all, s]) => {
      setSections(groupByDay(all, s.dailyGoal));
    }).finally(() => setIsLoading(false));
  }, []);

  useFocusEffect(reload);

  const weekTotal = sections.slice(0, 7).reduce((s, g) => s + g.total, 0);
  const now = new Date();

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteBottle(id);
      reload();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToastVisible(true);
      toastTimeoutRef.current = setTimeout(() => setToastVisible(false), 2000);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer ce biberon. Réessaie.');
    }
  }, [reload]);

  const handlePress = useCallback((bottle: Bottle) => {
    navigation.navigate('Édition', { bottle });
  }, [navigation]);

  return (
    <View style={s.historyRoot}>
      <SectionList
        style={s.scroll}
        contentContainerStyle={s.content}
        sections={sections}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={() => (
          <View style={s.headerRow}>
            <View>
              <Text style={s.h2}>Historique</Text>
              <Text style={s.weekTotal}>{weekTotal} ml cette semaine</Text>
            </View>
            <View style={s.monthBadge}>
              <Text style={s.calIcon}>📅</Text>
              <Text style={s.monthLabel}>
                {MONTH_NAMES[now.getMonth()].charAt(0).toUpperCase()
                  + MONTH_NAMES[now.getMonth()].slice(1)} {now.getFullYear()}
              </Text>
            </View>
          </View>
        )}

        ListEmptyComponent={() => isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <Text style={s.empty}>Aucun biberon enregistré.</Text>
        )}

        renderSectionHeader={({ section }) => (
          <View style={s.dayHeader}>
            <Text style={s.dayLabel}>{section.title}</Text>
            <View style={s.miniProgressBg}>
              <View style={[s.miniProgressFill, { width: `${section.pct}%` as any }]} />
            </View>
            <Text style={s.dayPct}>{section.pct}%</Text>
            <View style={s.dayTotalBadge}>
              <Text style={s.dayTotalText}>{section.total} ml</Text>
            </View>
          </View>
        )}

        renderItem={({ item, index }) => (
          <BibRow
            item={item}
            onDelete={handleDelete}
            onPress={handlePress}
            index={index}
          />
        )}

        SectionSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ItemSeparatorComponent={() => <View style={s.itemSep} />}
      />
      <Animated.View style={[s.toast, toastAnimStyle]} pointerEvents="none">
        <Text style={s.toastText}>Biberon supprimé</Text>
      </Animated.View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  historyRoot: { flex: 1 },
  scroll:  { flex: 1, backgroundColor: 'transparent' },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },

  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 18, paddingTop: 6,
  },
  h2:        { fontFamily: fonts.extraBold, fontSize: 28, fontWeight: '900', color: colors.text },
  weekTotal: { ...typography.small, color: colors.muted, marginTop: 2 },
  monthBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.card, borderRadius: 20,
    paddingVertical: 6, paddingHorizontal: 12, marginTop: 4,
  },
  calIcon:    { fontSize: 12 },
  monthLabel: { ...typography.caption, fontWeight: '600', color: colors.muted },

  empty: { ...typography.body, color: colors.muted, textAlign: 'center', marginTop: 40 },

  dayHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingHorizontal: 14,
    backgroundColor: colors.card, borderRadius: 12,
    marginBottom: 2,
  },
  dayLabel: { ...typography.small, fontWeight: '700', color: colors.text, flex: 1 },
  miniProgressBg: {
    width: 54, height: 3,
    backgroundColor: colors.accentSubtle,
    borderRadius: 99, overflow: 'hidden',
  },
  miniProgressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  dayPct:     { ...typography.label, color: colors.muted },
  dayTotalBadge: {
    backgroundColor: colors.accentSubtle, borderRadius: 10,
    paddingVertical: 3, paddingHorizontal: 10,
  },
  dayTotalText: { fontFamily: fonts.bold, fontSize: 12, fontWeight: '700', color: colors.acL },

  bibRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.card,
    paddingVertical: 11, paddingHorizontal: 13,
  },
  bibTime:    { ...typography.caption, color: colors.muted, minWidth: 38 },
  bottleIcon: { fontSize: 15 },
  bibInfo:    { flex: 1 },
  bibName:    { fontFamily: fonts.semiBold, fontSize: 13, fontWeight: '600', color: colors.text },
  bibNote:    { fontSize: 11, color: colors.muted, fontStyle: 'italic', marginTop: 1 },
  chevron:    { fontSize: 18, color: colors.muted },

  itemSep: { height: 2, backgroundColor: colors.bg },

  deleteAction: {
    backgroundColor: colors.error,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  deleteActionIcon: { fontSize: 16 },
  deleteActionText: { ...typography.label, color: colors.textOnAccent },

  badge: {
    borderWidth: 1, borderRadius: 10,
    paddingVertical: 3, paddingHorizontal: 10,
  },
  badgeText: { fontFamily: fonts.bold, fontSize: 12, fontWeight: '700' },

  toast: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  toastText: {
    ...typography.small,
    color: colors.text,
    fontWeight: '600',
  },
});
