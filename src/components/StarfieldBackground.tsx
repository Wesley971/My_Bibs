import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const STAR_COUNT = 40;
const SIZES = [1.5, 2, 2.5, 3] as const;

type StarData = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
};

// Positions et tailles figées au chargement du module (une seule fois)
const STARS: StarData[] = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: SIZES[Math.floor(Math.random() * SIZES.length)],
  delay: Math.random() * 3000,
  duration: 1500 + Math.random() * 2000,
}));

const Star = memo(function Star({ data }: { data: StarData }) {
  const opacity = useSharedValue(0.3 + Math.random() * 0.25);

  useEffect(() => {
    opacity.value = withDelay(
      data.delay,
      withRepeat(
        withSequence(
          withTiming(0.95, { duration: data.duration }),
          withTiming(0.3, { duration: data.duration }),
        ),
        -1,
        false,
      ),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: `${data.x}%` as any,
          top:  `${data.y}%` as any,
          width:        data.size,
          height:       data.size,
          borderRadius: data.size / 2,
        },
        animStyle,
      ]}
    />
  );
});

export default memo(function StarfieldBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
{STARS.map(star => <Star key={star.id} data={star} />)}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: colors.text,
  },
});
