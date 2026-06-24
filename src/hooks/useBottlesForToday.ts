import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getBottles, Bottle } from '../storage/bottleStorage';

export function useBottlesForToday() {
  const [bottles,  setBottles]  = useState<Bottle[]>([]);
  const [focusKey, setFocusKey] = useState(0);
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

  useFocusEffect(useCallback(() => {
    loadBottles();
  }, [loadBottles]));

  // Refresh automatique à minuit exact
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

  // Refresh si l'app revient au premier plan un jour différent
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

  return { bottles, loadBottles, focusKey };
}
