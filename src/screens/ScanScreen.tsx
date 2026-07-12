import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, Platform,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { IconCamera, IconCircleCheck, IconX } from '@tabler/icons-react-native';
import { saveBottle } from '../storage/bottleStorage';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius, circleRadius } from '../theme/radius';
import { typography, fonts } from '../theme/typography';
import { accentShadowSoft } from '../theme/shadows';
import { AccentGlow } from '../components/AccentGlow';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, TabParamList } from '../navigation/AppNavigator';

// ── Types ──────────────────────────────────────────────────────────────────────
type ScanNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Scan'>,
  StackNavigationProp<RootStackParamList>
>;

// ── Taille du cadre QR ────────────────────────────────────────────────────────
const FRAME = 216;
const CORNER = 28;

export default function ScanScreen({ navigation }: { navigation: ScanNavigationProp }) {
  // ── Logique caméra (inchangée) ────────────────────────────────────────────
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData]   = useState<string | null>(null);
  const [scanning, setScanning]         = useState(true);
  const isScanningRef                   = useRef(true);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission().then(result => {
        if (!result.granted) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      });
    }
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!isScanningRef.current) return;
    isScanningRef.current = false;
    setScanning(false);
    let parsed: { quantity?: string; notes?: string } = {};
    try { parsed = JSON.parse(data); }
    catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('QR invalide', 'Le QR code ne contient pas de JSON valide.');
      isScanningRef.current = true;
      setScanning(true);
      return;
    }
    if (!parsed.quantity) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Données manquantes', 'Le champ "quantity" est absent du QR code.');
      isScanningRef.current = true;
      setScanning(true);
      return;
    }
    try {
      await saveBottle(parsed.quantity, new Date(), parsed.notes);
      setScannedData(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Biberon enregistré',
        `${parsed.quantity} ml ajoutés avec succès.`,
        [{ text: 'OK', onPress: () => { isScanningRef.current = true; setScanning(true); } }],
      );
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Erreur', 'Impossible de sauvegarder le biberon.');
      isScanningRef.current = true;
      setScanning(true);
    }
  };

  const restartScan = () => { setScannedData(null); isScanningRef.current = true; setScanning(true); };

  const scanY = useSharedValue(0);
  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanY.value }],
  }));
  useEffect(() => {
    scanY.value = withRepeat(
      withSequence(
        withTiming(FRAME - 4, { duration: 1500 }),
        withTiming(0, { duration: 1500 }),
      ),
      -1,
      false,
    );
  }, []);

  // ── Permission refusée ────────────────────────────────────────────────────
  if (!permission?.granted) {
    return (
      <View style={s.permContainer}>
        <IconCamera size={48} color={colors.muted} />
        <Text style={s.permText}>Permission caméra requise</Text>
        <TouchableOpacity
          style={[s.permBtn, accentShadowSoft]}
          onPress={requestPermission}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Autoriser l'accès à la caméra"
        >
          {Platform.OS === 'android' && <AccentGlow borderRadius={radius.md} intensity="soft" />}
          <Text style={s.permBtnText}>Autoriser l'accès</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Résultat post-scan ────────────────────────────────────────────────────
  if (!scanning && scannedData) {
    return (
      <View style={s.resultContainer}>
        <IconCircleCheck size={48} color={colors.success} />
        <Text style={s.resultText}>Biberon enregistré</Text>
        <TouchableOpacity
          style={[s.permBtn, accentShadowSoft]}
          onPress={restartScan}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Scanner à nouveau"
        >
          {Platform.OS === 'android' && <AccentGlow borderRadius={radius.md} intensity="soft" />}
          <Text style={s.permBtnText}>Scanner à nouveau</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Vue principale ────────────────────────────────────────────────────────
  return (
    <View style={s.container}>

      {/* Header */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Ajout')}
        style={s.closeBtn}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Fermer le scanner"
      >
        <IconX size={14} color={colors.text} />
      </TouchableOpacity>
      <Text style={s.headerTitle}>Scanner</Text>
      <Text style={s.headerSub}>Identifiez votre biberon</Text>

      {/* Cadre QR */}
      <View style={s.frame}>
        {scanning && (
          <CameraView
            style={StyleSheet.absoluteFill}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
        )}

        {/* Coins */}
        <View style={[s.corner, s.cornerTL]} />
        <View style={[s.corner, s.cornerTR]} />
        <View style={[s.corner, s.cornerBL]} />
        <View style={[s.corner, s.cornerBR]} />

        {/* Ligne de scan animée */}
        <Animated.View style={[s.scanLine, scanLineStyle]} />
      </View>

      <Text style={s.instruction}>Placez le code QR dans le cadre</Text>
      <Text style={s.instructionSub}>La reconnaissance est automatique</Text>

      {/* Séparateur */}
      <View style={s.separator}>
        <View style={s.sepLine} />
        <Text style={s.sepText}>ou</Text>
        <View style={s.sepLine} />
      </View>

      {/* Bouton manuel */}
      <TouchableOpacity
        style={s.manualBtn}
        onPress={() => navigation.navigate('Ajout')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Saisir manuellement"
      >
        <Text style={s.manualBtnText}>Saisir manuellement</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
  },

  // Header
  closeBtn: {
    alignSelf: 'flex-start',
    width: 36, height: 36, borderRadius: circleRadius(36),
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle:  { fontFamily: fonts.extraBold, fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
  headerSub:    { ...typography.small, color: colors.muted, marginBottom: 36 },

  // Cadre QR
  frame: {
    width: FRAME, height: FRAME,
    marginBottom: 28,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: colors.accentGhost,
  },

  // Coins
  corner: {
    position: 'absolute',
    width: CORNER, height: CORNER,
    borderColor: colors.accent,
    borderStyle: 'solid',
  },
  cornerTL: { top: 0,    left: 0,   borderTopWidth: 3, borderLeftWidth: 3,
               borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 7 },
  cornerTR: { top: 0,    right: 0,  borderTopWidth: 3, borderRightWidth: 3,
               borderLeftWidth: 0,  borderBottomWidth: 0, borderTopRightRadius: 7 },
  cornerBL: { bottom: 0, left: 0,   borderBottomWidth: 3, borderLeftWidth: 3,
               borderTopWidth: 0,   borderRightWidth: 0,  borderBottomLeftRadius: 7 },
  cornerBR: { bottom: 0, right: 0,  borderBottomWidth: 3, borderRightWidth: 3,
               borderTopWidth: 0,   borderLeftWidth: 0,   borderBottomRightRadius: 7 },

  // Ligne de scan
  scanLine: {
    position: 'absolute',
    left: 4, right: 4, height: 2,
    backgroundColor: colors.accent,
    opacity: 0.85,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },

  // Instructions
  instruction:    { fontFamily: fonts.bold, fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4, textAlign: 'center' },
  instructionSub: { ...typography.small, color: colors.muted, marginBottom: 32, textAlign: 'center' },

  // Séparateur
  separator: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', marginBottom: 20 },
  sepLine:   { flex: 1, height: 1, backgroundColor: colors.border },
  sepText:   { ...typography.small, color: colors.muted, fontWeight: '600' },

  // Bouton manuel
  manualBtn: {
    width: '100%', paddingVertical: 14,
    backgroundColor: colors.card,
    borderWidth: 1.5, borderColor: colors.accent,
    borderRadius: radius.md, alignItems: 'center',
  },
  manualBtnText: { fontFamily: fonts.bold, fontSize: 15, fontWeight: '700', color: colors.text },

  // Permission
  permContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
    gap: 16, paddingHorizontal: 32,
  },
  permText: { ...typography.body, color: colors.muted, textAlign: 'center' },
  permBtn: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: 12, paddingHorizontal: 24,
  },
  permBtnText: { fontFamily: fonts.bold, fontSize: 15, fontWeight: '700', color: colors.textOnAccent },

  // Résultat
  resultContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
    gap: 16, paddingHorizontal: 32,
  },
  resultText: { fontFamily: fonts.bold, fontSize: 18, fontWeight: '700', color: colors.text },
});
