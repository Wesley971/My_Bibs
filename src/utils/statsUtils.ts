import { Bottle } from '../storage/bottleStorage';

export type DayStats = {
  date: string;       // YYYY-MM-DD
  label: string;      // 'lun', 'mar', …
  total: number;
  goalReached: boolean;
};

const SHORT_DAYS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getLast7DaysData(bottles: Bottle[], dailyGoal: number): DayStats[] {
  const totals = new Map<string, number>();
  for (const b of bottles) {
    const key = toKey(new Date(b.timestamp));
    totals.set(key, (totals.get(key) ?? 0) + b.quantity);
  }

  const result: DayStats[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = toKey(d);
    const total = totals.get(key) ?? 0;
    result.push({ date: key, label: SHORT_DAYS[d.getDay()], total, goalReached: total >= dailyGoal });
  }
  return result;
}

export function getCurrentStreak(bottles: Bottle[], dailyGoal: number): number {
  const totals = new Map<string, number>();
  for (const b of bottles) {
    const key = toKey(new Date(b.timestamp));
    totals.set(key, (totals.get(key) ?? 0) + b.quantity);
  }

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    if ((totals.get(toKey(d)) ?? 0) >= dailyGoal) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
