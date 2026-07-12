import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { cardShadow } from '../theme/shadows';

type Props = {
  children: ReactNode;
  padding?: number;
  style?: StyleProp<ViewStyle>;
};

/** Surface container — matière (dégradé interne clair/sombre) + élévation douce et diffuse, jamais de bordure dure. Le seul style de carte utilisé partout (total du jour, métriques, groupes de liste). */
export function Card({ children, padding = spacing.xl, style }: Props) {
  return (
    <View style={[s.card, { padding }, cardShadow, style]}>
      {/* borderRadius directement sur le LinearGradient (pas overflow:hidden sur
         la View parente) car overflow:hidden sur la même View que l'ombre
         (shadowXxx) la ferait disparaître silencieusement sur iOS/Android. */}
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.015)']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[StyleSheet.absoluteFillObject, s.gradient]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
  },
  gradient: {
    borderRadius: radius.lg,
  },
});
