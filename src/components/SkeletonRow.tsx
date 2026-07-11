import { memo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';

const HEIGHTS = { row: 64, card: 110, chart: 180 } as const;

type Props = { variant?: keyof typeof HEIGHTS };

/** Placeholder pulsant utilisé pendant le chargement — la forme correspond à ce qu'il remplace. */
export const SkeletonRow = memo(function SkeletonRow({ variant = 'row' }: Props) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 700 }),
        withTiming(0.4, { duration: 700 }),
      ),
      -1,
      false,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.row,
        { height: HEIGHTS[variant], borderRadius: variant === 'chart' ? radius.lg : radius.md },
        animStyle,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.card,
    marginBottom: 8,
  },
});
