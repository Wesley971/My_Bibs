import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { typography, fonts } from '../theme/typography';
import { accentShadow } from '../theme/shadows';

type Variant = 'primary' | 'outline' | 'ghost';

type Props = {
  children: ReactNode;
  /** primary = CTA plein violet (action principale) ; outline = fond carte + bordure accent (action secondaire) ; ghost = texte seul, faible emphase. */
  variant?: Variant;
  disabled?: boolean;
  /** Affiche un spinner et bloque l'interaction, sans décaler la mise en page. */
  loading?: boolean;
  /** Bascule vers le fond succès (sauge) — état de confirmation post-sauvegarde. */
  success?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function Button({ children, variant = 'primary', disabled = false, loading = false, success = false, onPress, style, accessibilityLabel }: Props) {
  const isDisabled = disabled || loading;
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const isMainCta = variant === 'primary';
  const activeOpacity = isMainCta ? 0.85 : 0.7;

  const backgroundColor =
    success ? colors.success :
    variant === 'primary' ? colors.accent :
    variant === 'outline' ? colors.card : 'transparent';

  const textColor =
    success || variant === 'primary' ? colors.textOnAccent :
    variant === 'outline' ? colors.text : colors.muted;

  const content = (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={activeOpacity}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPressIn={() => { if (isMainCta && !isDisabled) scale.value = withSpring(0.95); }}
      onPressOut={() => { if (isMainCta) scale.value = withSpring(1); }}
      style={[
        s.base,
        variant === 'ghost' && s.ghost,
        { backgroundColor, opacity: disabled ? 0.5 : loading ? 0.75 : 1 },
        variant === 'outline' && { borderWidth: 1.5, borderColor: colors.accent },
        isMainCta && !success ? accentShadow : null,
        style,
      ]}
    >
      {loading && <ActivityIndicator size="small" color={textColor} style={s.spinner} />}
      {typeof children === 'string'
        ? <Animated.Text style={[s.text, { color: textColor }, variant === 'ghost' && s.ghostText]}>{children}</Animated.Text>
        : children}
    </TouchableOpacity>
  );

  return isMainCta ? <Animated.View style={animStyle}>{content}</Animated.View> : content;
}

const s = StyleSheet.create({
  base: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 17,
    paddingHorizontal: 24,
    borderRadius: radius.lg,
  },
  ghost: {
    width: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  text: {
    fontFamily: fonts.extraBold,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  ghostText: {
    ...typography.small,
    fontWeight: '600',
  },
  spinner: {
    marginRight: 2,
  },
});
