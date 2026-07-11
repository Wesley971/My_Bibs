import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { fonts } from '../theme/typography';
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
  const t = TONES[qtyTone(qty)];
  return (
    <View style={[s.badge, { backgroundColor: t.bg }]}>
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
