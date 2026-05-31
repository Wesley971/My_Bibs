import React, { useState, useCallback } from "react";
import {
  StyleSheet, SectionList, View, Text,
  TouchableOpacity, Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBottles, deleteBottle } from "../storage/bottleStorage";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

// ── Types ──────────────────────────────────────────────────────────────────────
type Bottle = { id: string; quantity: number; timestamp: string; notes: string };
type DaySection = { title: string; total: number; pct: number; data: Bottle[] };

// ── Constantes ─────────────────────────────────────────────────────────────────
const DAILY_GOAL = 800;
const MONTH_NAMES = [
  'janvier','février','mars','avril','mai','juin',
  'juillet','août','septembre','octobre','novembre','décembre',
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function dayLabel(dateStr: string): string {
  const d       = new Date(dateStr);
  const today   = new Date().toDateString();
  const yest    = new Date(Date.now() - 86400000).toDateString();
  if (d.toDateString() === today) return `Aujourd'hui · ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  if (d.toDateString() === yest)  return `Hier · ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function groupByDay(bottles: Bottle[]): DaySection[] {
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
      const pct   = Math.min(100, Math.round((total / DAILY_GOAL) * 100));
      return { title: dayLabel(key), total, pct, data: bibs };
    });
}

function timeStr(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2, '0')}`;
}

// ── QtyBadge ───────────────────────────────────────────────────────────────────
function QtyBadge({ qty }: { qty: number }) {
  const good = qty >= 130, low = qty <= 75;
  const bg   = good ? colors.goodBg  : low ? colors.lowBg  : 'rgba(167,139,250,0.18)';
  const bdr  = good ? colors.goodBdr : low ? colors.lowBdr : 'rgba(167,139,250,0.35)';
  const col  = good ? colors.goodText: low ? colors.lowText: colors.acL;
  return (
    <View style={[s.badge, { backgroundColor: bg, borderColor: bdr }]}>
      <Text style={[s.badgeText, { color: col }]}>{qty} ml</Text>
    </View>
  );
}

// ── Écran ──────────────────────────────────────────────────────────────────────
export default function HistoryScreen() {
  const [sections, setSections] = useState<DaySection[]>([]);

  const reload = useCallback(() => {
    getBottles().then(all => setSections(groupByDay(all)));
  }, []);

  useFocusEffect(reload);

  const weekTotal = sections
    .slice(0, 7)
    .reduce((s, g) => s + g.total, 0);

  const now = new Date();

  function confirmDelete(id: string) {
    Alert.alert(
      'Supprimer',
      'Supprimer ce biberon ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive',
          onPress: async () => { await deleteBottle(id); reload(); } },
      ],
      { cancelable: true },
    );
  }

  return (
    <SectionList
      style={s.scroll}
      contentContainerStyle={s.content}
      sections={sections}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}

      // ── En-tête global ─────────────────────────────────────
      ListHeaderComponent={() => (
        <View style={s.headerRow}>
          <View>
            <Text style={s.h2}>Historique</Text>
            <Text style={s.weekTotal}>{weekTotal} ml cette semaine</Text>
          </View>
          <View style={s.monthBadge}>
            <Text style={s.calIcon}>◷</Text>
            <Text style={s.monthLabel}>
              {MONTH_NAMES[now.getMonth()].charAt(0).toUpperCase()
                + MONTH_NAMES[now.getMonth()].slice(1)} {now.getFullYear()}
            </Text>
          </View>
        </View>
      )}

      ListEmptyComponent={() => (
        <Text style={s.empty}>Aucun biberon enregistré.</Text>
      )}

      // ── Bandeau par jour ────────────────────────────────────
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

      // ── Ligne biberon ───────────────────────────────────────
      renderItem={({ item }) => (
        <View style={s.bibRow}>
          <Text style={s.bibTime}>{timeStr(item.timestamp)}</Text>
          <Text style={s.bottleIcon}>🍼</Text>
          <View style={s.bibInfo}>
            <Text style={s.bibName}>Biberon</Text>
            {item.notes ? (
              <Text style={s.bibNote}>{item.notes}</Text>
            ) : null}
          </View>
          <QtyBadge qty={item.quantity} />
          <TouchableOpacity onPress={() => confirmDelete(item.id)} style={s.deleteBtn}>
            <Text style={s.deleteIcon}>🗑</Text>
          </TouchableOpacity>
        </View>
      )}

      SectionSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      ItemSeparatorComponent={() => <View style={s.itemSep} />}
    />
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },

  // En-tête global
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 18, paddingTop: 6,
  },
  h2:        { fontSize: 28, fontWeight: '900', color: colors.text },
  weekTotal: { ...typography.small, color: colors.muted, marginTop: 2 },
  monthBadge:{
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.card, borderRadius: 20,
    paddingVertical: 6, paddingHorizontal: 12, marginTop: 4,
  },
  calIcon:    { fontSize: 13, color: colors.muted },
  monthLabel: { ...typography.caption, fontWeight: '600', color: colors.muted },

  empty: { ...typography.body, color: colors.muted, textAlign: 'center', marginTop: 40 },

  // Bandeau jour
  dayHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingHorizontal: 14,
    backgroundColor: colors.card, borderRadius: 12,
    marginBottom: 2,
  },
  dayLabel: { ...typography.small, fontWeight: '700', color: colors.text, flex: 1 },
  miniProgressBg: {
    width: 54, height: 3,
    backgroundColor: 'rgba(167,139,250,0.15)',
    borderRadius: 99, overflow: 'hidden',
  },
  miniProgressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 99 },
  dayPct:     { ...typography.label, color: colors.muted },
  dayTotalBadge: {
    backgroundColor: 'rgba(167,139,250,0.16)', borderRadius: 10,
    paddingVertical: 3, paddingHorizontal: 10,
  },
  dayTotalText: { fontSize: 12, fontWeight: '700', color: colors.acL },

  // Ligne biberon
  bibRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.card,
    paddingVertical: 11, paddingHorizontal: 13,
  },
  bibTime:     { ...typography.caption, color: colors.muted, minWidth: 38 },
  bottleIcon:  { fontSize: 15 },
  bibInfo:     { flex: 1 },
  bibName:     { fontSize: 13, fontWeight: '600', color: colors.text },
  bibNote:     { fontSize: 11, color: colors.muted, fontStyle: 'italic', marginTop: 1 },

  deleteBtn:   { padding: 4 },
  deleteIcon:  { fontSize: 15 },

  itemSep: { height: 2, backgroundColor: colors.bg },

  // Badge quantité
  badge: {
    borderWidth: 1, borderRadius: 10,
    paddingVertical: 3, paddingHorizontal: 10,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
});
