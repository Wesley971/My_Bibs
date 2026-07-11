import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';
import { IconMinus, IconPlus } from '@tabler/icons-react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { IconButton } from './IconButton';

const SIZES = {
  md: { value: 44, unit: 18 },
  lg: { value: 64, unit: 19 },
} as const;

type Props = {
  value: number;
  unit?: string;
  size?: keyof typeof SIZES;
  onDecrement: () => void;
  onIncrement: () => void;
};

export function Stepper({ value, unit = 'ml', size = 'lg', onDecrement, onIncrement }: Props) {
  const d = SIZES[size];

  function decrement() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecrement();
  }

  function increment() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onIncrement();
  }

  return (
    <View style={s.row}>
      <IconButton variant="default" onPress={decrement} accessibilityLabel="Diminuer">
        <IconMinus size={22} color={colors.text} />
      </IconButton>
      <View style={s.valueBox}>
        <Text style={[s.value, { fontSize: d.value }]}>{value}</Text>
        <Text style={[s.unit, { fontSize: d.unit }]}>{unit}</Text>
      </View>
      <IconButton variant="accent" onPress={increment} accessibilityLabel="Augmenter">
        <IconPlus size={22} color={colors.textOnAccent} />
      </IconButton>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  valueBox: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, minWidth: 90, justifyContent: 'center' },
  value: { fontFamily: fonts.display, fontWeight: '500', color: colors.text },
  unit: { fontFamily: fonts.bold, fontWeight: '700', color: colors.acL, paddingBottom: 4 },
});
