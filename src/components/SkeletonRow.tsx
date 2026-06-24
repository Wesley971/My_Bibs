import { memo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

export const SkeletonRow = memo(function SkeletonRow() {
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

  return <Animated.View style={[styles.row, animStyle]} />;
});

const styles = StyleSheet.create({
  row: {
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.card,
    marginBottom: 8,
  },
});
