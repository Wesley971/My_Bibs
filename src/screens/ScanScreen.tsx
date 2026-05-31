import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Animated, Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { saveBottle } from '../storage/bottleStorage';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// ── Taille du cadre QR ────────────────────────────────────────────────────────
const FRAME = 216;
const CORNER = 28;

export default function ScanScreen({ navigation }: any) {
  // ── Logique caméra (inchangée) ────────────────────────────────────────────
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData]   = useState<string | null>(null);
  const [scanning, setScanning]         = useState(true);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanning(false);
    let parsed: { quantity?: string; notes?: string } = {};
    try { parsed = JSON.parse(data); }
    catch {
      Alert.alert('QR invalide', 'Le QR code ne contient pas de JSON valide.');
      setScanning(true);
      return;
    }
    if (!parsed.quantity) {
      Alert.alert('Données manquantes', 'Le champ "quantity" est absent du QR code.');
      setScanning(true);
      return;
    }
    try {
      await saveBottle(parsed.quantity, new Date(), parsed.notes);
      setScannedData(data);
      Alert.alert(
        'Biberon enregistré',
        `${parsed.quantity} ml ajoutés avec succès.`,
        [{ text: 'OK', onPress: () => setScanning(true) }],
      );
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder le biberon.');
      setScanning(true);
    }
  };

  const restartScan = () => { setScannedData(null); setScanning(true); };

  // ── Animation ligne de scan (Animated.loop, pas de Reanimated) ────────────
  const scanY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, {
          toValue: FRAME - 4,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scanY, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // ── Permission refusée ────────────────────────────────────────────────────
  if (!permission?.granted) {
    return (
      <View style={s.permContainer}>
        <Text style={s.permIcon}>📷</Text>
        <Text style={s.permText}>Permission caméra requise</Text>
        <TouchableOpacity style={s.permBtn} onPress={requestPermission}>
          <Text style={s.permBtnText}>Autoriser l'accès</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Résultat post-scan ────────────────────────────────────────────────────
  if (!scanning && scannedData) {
    return (
      <View style={s.resultContainer}>
        <Text style={s.resultIcon}>✅</Text>
        <Text style={s.resultText}>Biberon enregistré</Text>
        <TouchableOpacity style={s.permBtn} onPress={restartScan}>
          <Text style={s.permBtnText}>Scanner à nouveau</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Vue principale ────────────────────────────────────────────────────────
  return (
    <View style={s.container}>

      {/* Header */}
      <TouchableOpacity onPress={() => navigation.navigate('Ajout')} style={s.closeBtn}>
        <Text style={s.closeIcon}>✕</Text>
      </TouchableOpacity>
      <Text style={s.headerTitle}>Scanner</Text>
      <Text style={s.headerSub}>Identifiez votre biberon</Text>

      {/* Cadre QR */}
      <View style={s.frame}>
        {scanning && (
          <CameraView
            style={StyleSheet.absoluteFill}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a'] }}
          />
        )}

        {/* Coins */}
        <View style={[s.corner, s.cornerTL]} />
        <View style={[s.corner, s.cornerTR]} />
        <View style={[s.corner, s.cornerBL]} />
        <View style={[s.corner, s.cornerBR]} />

        {/* Ligne de scan animée */}
        <Animated.View
          style={[s.scanLine, { transform: [{ translateY: scanY }] }]}
        />
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
      <TouchableOpacity style={s.manualBtn} onPress={() => navigation.navigate('Ajout')}>
        <Text style={s.manualBtnText}>Saisir manuellement</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
  },

  // Header
  closeBtn: {
    alignSelf: 'flex-start',
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  closeIcon:    { color: colors.text, fontSize: 14 },
  headerTitle:  { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
  headerSub:    { ...typography.small, color: colors.muted, marginBottom: 36 },

  // Cadre QR
  frame: {
    width: FRAME, height: FRAME,
    marginBottom: 28,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: 'rgba(167,139,250,0.04)',
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
  instruction:    { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4, textAlign: 'center' },
  instructionSub: { ...typography.caption, color: colors.muted, marginBottom: 32, textAlign: 'center' },

  // Séparateur
  separator: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', marginBottom: 20 },
  sepLine:   { flex: 1, height: 1, backgroundColor: colors.border },
  sepText:   { ...typography.small, color: colors.muted, fontWeight: '600' },

  // Bouton manuel
  manualBtn: {
    width: '100%', paddingVertical: 14,
    backgroundColor: colors.card,
    borderWidth: 1.5, borderColor: colors.accent,
    borderRadius: 14, alignItems: 'center',
  },
  manualBtnText: { fontSize: 15, fontWeight: '700', color: colors.text },

  // Permission
  permContainer: {
    flex: 1, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
    gap: 16, paddingHorizontal: 32,
  },
  permIcon: { fontSize: 48 },
  permText: { ...typography.body, color: colors.muted, textAlign: 'center' },
  permBtn: {
    backgroundColor: colors.accent, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 24,
  },
  permBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },

  // Résultat
  resultContainer: {
    flex: 1, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
    gap: 16, paddingHorizontal: 32,
  },
  resultIcon: { fontSize: 48 },
  resultText: { fontSize: 18, fontWeight: '700', color: colors.text },
});
