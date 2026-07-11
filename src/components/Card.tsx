import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { cardShadow } from '../theme/shadows';

type Props = {
  children: ReactNode;
  padding?: number;
  style?: ViewStyle;
};

/** Surface container — élévation douce et diffuse, jamais de bordure dure. Le seul style de carte utilisé partout (total du jour, métriques, groupes de liste). */
export function Card({ children, padding = spacing.xl, style }: Props) {
  return (
    <View style={[s.card, { padding }, cardShadow, style]}>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
  },
});
