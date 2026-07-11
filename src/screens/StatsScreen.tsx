import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Svg, { Line as SvgLine } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { getBottles } from '../storage/bottleStorage';
import { getSettings } from '../storage/settingsStorage';
import { getLast7DaysData, getCurrentStreak, DayStats } from '../utils/statsUtils';
import { DAILY_GOAL_DEFAULT } from '../config/constants';
import { SkeletonRow } from '../components/SkeletonRow';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { typography, fonts } from '../theme/typography';

// ── Constantes ────────────────────────────────────────────────────────────────
const CHART_H = 220;
const MONTH_NAMES = ['jan','fév','mar','avr','mai','juin','juil','aoû','sep','oct','nov','déc'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatShortDate(dateKey: string): string {
  const parts = dateKey.split('-');
  return `${parseInt(parts[2], 10)} ${MONTH_NAMES[parseInt(parts[1], 10) - 1]}`;
}

// ── MetricCard ────────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={s.metricCard}>
      <Text style={s.metricLabel}>{label}</Text>
      <Text style={s.metricValue}>{value}</Text>
      {sub ? <Text style={s.metricSub}>{sub}</Text> : null}
    </View>
  );
}

// ── BarChart ──────────────────────────────────────────────────────────────────
function BarChart({ dayStats, dailyGoal }: { dayStats: DayStats[]; dailyGoal: number }) {
  const [chartWidth, setChartWidth] = useState(0);
  const maxY = Math.max(dailyGoal, ...dayStats.map(d => d.total), 1);
  const goalY = CHART_H - (dailyGoal / maxY) * CHART_H;

  return (
    <>
      <View
        style={s.chartContainer}
        onLayout={e => setChartWidth(e.nativeEvent.layout.width)}
      >
        {/* Ligne objectif en SVG */}
        {chartWidth > 0 && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width={chartWidth} height={CHART_H}>
              <SvgLine
                x1={0} y1={goalY}
                x2={chartWidth} y2={goalY}
                stroke={colors.muted}
                strokeDasharray="5,4"
                strokeWidth={1.5}
                opacity={0.7}
              />
            </Svg>
          </View>
        )}

        {/* Barres */}
        <View style={s.barsRow}>
          {dayStats.map((d, i) => {
            const barH = d.total > 0
              ? Math.max((d.total / maxY) * CHART_H, 4)
              : 0;
            return (
              <View key={i} style={s.barWrapper}>
                <View
                  style={[
                    s.bar,
                    {
                      height: barH,
                      backgroundColor: d.goalReached ? colors.success : colors.accent,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* Labels axe X */}
      <View style={s.xLabelsRow}>
        {dayStats.map((d, i) => (
          <Text key={i} style={s.xLabel}>{d.label}</Text>
        ))}
      </View>

      {/* Légende ligne objectif */}
      <View style={s.goalLegend}>
        <View style={s.goalDash} />
        <Text style={s.goalLegendText}>Objectif {dailyGoal} ml</Text>
      </View>
    </>
  );
}

// ── Écran ──────────────────────────────────────────────────────────────────────
export default function StatsScreen() {
  const [dayStats,  setDayStats]  = useState<DayStats[]>([]);
  const [dailyGoal, setDailyGoal] = useState(DAILY_GOAL_DEFAULT);
  const [streak,    setStreak]    = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    setIsLoading(true);
    Promise.all([getBottles(), getSettings()]).then(([bottles, settings]) => {
      const goal = settings.dailyGoal ?? DAILY_GOAL_DEFAULT;
      setDailyGoal(goal);
      setDayStats(getLast7DaysData(bottles, goal));
      setStreak(getCurrentStreak(bottles, goal));
    }).finally(() => setIsLoading(false));
  }, []));

  // ── Métriques ──
  const weekTotal    = dayStats.reduce((s, d) => s + d.total, 0);
  const avgPerDay    = Math.round(weekTotal / 7);
  const goalsReached = dayStats.filter(d => d.goalReached).length;
  const bestDay      = dayStats.length > 0
    ? dayStats.reduce((best, d) => d.total > best.total ? d : best, dayStats[0])
    : null;

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── En-tête ── */}
      <View style={s.header}>
        <Text style={s.title}>Statistiques</Text>
        <Text style={s.subtitle}>7 derniers jours</Text>
      </View>

      {isLoading ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : (
        <>
          {/* ── Graphique barres ── */}
          <View style={s.card}>
            <Text style={s.sectionLabel}>QUANTITÉ PAR JOUR</Text>
            <BarChart dayStats={dayStats} dailyGoal={dailyGoal} />
          </View>

          {/* ── Métriques 2×2 ── */}
          <View style={s.metricsGrid}>
            <View style={s.metricsRow}>
              <MetricCard
                label="Moyenne / jour"
                value={`${avgPerDay} ml`}
              />
              <MetricCard
                label="Meilleur jour"
                value={bestDay && bestDay.total > 0 ? `${bestDay.total} ml` : '—'}
                sub={bestDay && bestDay.total > 0 ? formatShortDate(bestDay.date) : undefined}
              />
            </View>
            <View style={s.metricsRow}>
              <MetricCard
                label="Objectif atteint"
                value={`${goalsReached} / 7`}
                sub="jours"
              />
              <MetricCard
                label="Total 7 jours"
                value={`${weekTotal} ml`}
              />
            </View>
          </View>

          {/* ── Streak ── */}
          <View style={[s.card, s.streakCard]}>
            {streak > 0 ? (
              <>
                <Text style={s.streakNum}>{streak}</Text>
                <Text style={s.streakLabel}>jours consécutifs 🔥</Text>
              </>
            ) : (
              <Text style={s.streakZero}>Objectif non atteint aujourd'hui</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: 'transparent' },
  content: { padding: spacing.lg, paddingBottom: 100 },

  header: { paddingTop: 6, marginBottom: 24 },
  title:  { ...typography.h1, color: colors.text },
  subtitle: { ...typography.small, color: colors.muted, marginTop: 2 },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.muted,
    marginBottom: 16,
    textTransform: 'uppercase',
  },

  // ── Chart ──
  chartContainer: {
    height: CHART_H,
    position: 'relative',
    marginBottom: 8,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_H,
    gap: 5,
  },
  barWrapper: {
    flex: 1,
    height: CHART_H,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '75%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  xLabelsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  xLabel: {
    flex: 1,
    textAlign: 'center',
    ...typography.label,
    color: colors.muted,
  },
  goalLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  goalDash: {
    width: 18,
    height: 1.5,
    backgroundColor: colors.muted,
    opacity: 0.7,
  },
  goalLegendText: {
    ...typography.small,
    color: colors.muted,
  },

  // ── Metrics grid ──
  metricsGrid: {
    gap: 12,
    marginBottom: spacing.xxl,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: {
    ...typography.small,
    color: colors.muted,
    marginBottom: 8,
  },
  metricValue: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
  },
  metricSub: {
    ...typography.small,
    color: colors.muted,
    marginTop: 4,
  },

  // ── Streak ──
  streakCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  streakNum: {
    fontFamily: fonts.extraBold,
    fontSize: 64,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 64,
  },
  streakLabel: {
    ...typography.body,
    color: colors.muted,
    marginTop: 10,
  },
  streakZero: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
  },
});
