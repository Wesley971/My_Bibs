import { ReactNode } from 'react';
import { Platform, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { circleRadius } from '../theme/radius';
import { accentShadowSoft, iconButtonShadow } from '../theme/shadows';
import { AccentGlow } from './AccentGlow';

const SIZES = { sm: 36, md: 50, lg: 60 } as const;

type Props = {
  children: ReactNode;
  size?: keyof typeof SIZES;
  /** default = fond neutre card2 (ex: bouton "−"); accent = fond violet plein avec lueur (ex: bouton "+", FAB). */
  variant?: 'default' | 'accent';
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function IconButton({ children, size = 'md', variant = 'default', onPress, style, accessibilityLabel }: Props) {
  const d = SIZES[size];
  const isAccent = variant === 'accent';
  const r = circleRadius(d);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        s.base,
        {
          width: d,
          height: d,
          borderRadius: r,
          backgroundColor: isAccent ? colors.accent : colors.iconCircleBg,
        },
        isAccent ? accentShadowSoft : iconButtonShadow,
        style,
      ]}
    >
      {isAccent && Platform.OS === 'android' && (
        <AccentGlow width={d} height={d} borderRadius={r} intensity="soft" />
      )}
      {children}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
