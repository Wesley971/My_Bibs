import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { circleRadius } from '../theme/radius';
import { accentShadowSoft } from '../theme/shadows';

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
          borderRadius: circleRadius(d),
          backgroundColor: isAccent ? colors.accent : colors.card2,
        },
        isAccent ? accentShadowSoft : null,
        !isAccent && { borderWidth: 1, borderColor: colors.border },
        style,
      ]}
    >
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
