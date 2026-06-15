import AsyncStorage from "@react-native-async-storage/async-storage";
import { DAILY_GOAL_DEFAULT } from "../config/constants";

export type Settings = {
  childName: string;
  dailyGoal: number;
  isOnboardingDone: boolean;
};

const KEY = "settings";

const DEFAULTS: Settings = {
  childName: '',
  dailyGoal: DAILY_GOAL_DEFAULT,
  isOnboardingDone: false,
};

export const getSettings = async (): Promise<Settings> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
};

export const saveSettings = async (partial: Partial<Settings>): Promise<void> => {
  const current = await getSettings();
  await AsyncStorage.setItem(KEY, JSON.stringify({ ...current, ...partial }));
};

export const isFirstLaunch = async (): Promise<boolean> => {
  const s = await getSettings();
  return !s.isOnboardingDone;
};
