import { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { typography } from '../theme/typography';

export function Toast({ children, visible }: { children: ReactNode; visible: boolean }) {
  const opacity = useSharedValue(0);
  opacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[s.toast, animStyle]} pointerEvents="none">
      <Text style={s.text}>{children}</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  text: {
    ...typography.small,
    color: colors.text,
  },
});
