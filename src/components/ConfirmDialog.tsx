import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography, fonts } from '../theme/typography';
import { Card } from './Card';

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Bascule le bouton de confirmation vers le rouge désaturé (colors.error) — actions irréversibles. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Modale de confirmation cohérente avec le design system — remplace Alert.alert (angles carrés, chrome OS). */
export function ConfirmDialog({
  visible, title, message, confirmLabel = 'Confirmer', cancelLabel = 'Annuler',
  destructive = false, onConfirm, onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={s.backdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onCancel} accessibilityLabel="Fermer" />
        <Card style={s.card}>
          <Text style={s.title}>{title}</Text>
          {message ? <Text style={s.message}>{message}</Text> : null}

          <View style={s.actions}>
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.7}
              style={s.cancelBtn}
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
            >
              <Text style={s.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              activeOpacity={0.85}
              style={[s.confirmBtn, destructive && s.confirmBtnDestructive]}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
            >
              <Text style={s.confirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
  },
  title: { ...typography.h2, color: colors.text, marginBottom: 8 },
  message: { ...typography.body, color: colors.muted, marginBottom: spacing.xl },
  actions: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: radius.md,
    backgroundColor: colors.card2,
    alignItems: 'center',
  },
  cancelText: { fontFamily: fonts.extraBold, fontSize: 15, fontWeight: '800', color: colors.text },
  confirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  confirmBtnDestructive: { backgroundColor: colors.error },
  confirmText: { fontFamily: fonts.extraBold, fontSize: 15, fontWeight: '800', color: colors.textOnAccent },
});
