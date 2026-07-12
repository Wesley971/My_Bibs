import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { fonts } from '../theme/typography';
import { accentShadowSubtle } from '../theme/shadows';
import { AccentGlow } from './AccentGlow';
import { BADGE_GREEN_MIN, BADGE_ORANGE_MAX } from '../config/constants';

/** Détermine le ton de la même façon que partout dans l'app : >= 130 ml good, <= 75 ml low, sinon neutre. */
function qtyTone(qty: number): 'good' | 'low' | 'neutral' {
  if (qty >= BADGE_GREEN_MIN) return 'good';
  if (qty <= BADGE_ORANGE_MAX) return 'low';
  return 'neutral';
}

const TONES = {
  neutral: { bg: colors.border, text: colors.acL },
  good:    { bg: colors.goodBg, text: colors.goodText },
  low:     { bg: colors.lowBg,  text: colors.lowText },
} as const;

export function QtyBadge({ qty }: { qty: number }) {
  const tone = qtyTone(qty);
  const t = TONES[tone];
  // Seul le ton neutre est réellement teinté accent (texte acL) — good/low
  // sont des tons sémantiques (vert/orange) sans lien avec l'accent violet.
  const isAccentToned = tone === 'neutral';
  return (
    <View style={[s.badge, { backgroundColor: t.bg }, isAccentToned && accentShadowSubtle]}>
      {isAccentToned && Platform.OS === 'android' && (
        <AccentGlow borderRadius={radius.sm} intensity="subtle" />
      )}
      <Text style={[s.text, { color: t.text }]}>{qty} ml</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: '700',
  },
});
