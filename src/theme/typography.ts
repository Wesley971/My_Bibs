// Styles typographiques extraits du design HTML (police cible : Nunito)
// En attendant le chargement de Nunito via expo-font,
// on utilise la police système (iOS : SF Pro, Android : Roboto).
import { Platform } from 'react-native';

export const fontFamily = Platform.select({
  ios:     'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  // ── Grands chiffres ────────────────────────────────────────
  display: { fontSize: 40, fontWeight: '900' as const, letterSpacing: -0.5 },
  hero:    { fontSize: 64, fontWeight: '900' as const, lineHeight: 64 },
  total:   { fontSize: 56, fontWeight: '900' as const, lineHeight: 56 },

  // ── Titres ─────────────────────────────────────────────────
  h2:    { fontSize: 28, fontWeight: '900' as const },
  h3:    { fontSize: 20, fontWeight: '800' as const },
  title: { fontSize: 17, fontWeight: '800' as const },

  // ── Corps ──────────────────────────────────────────────────
  body:  { fontSize: 15, fontWeight: '600' as const },
  bodyS: { fontSize: 14, fontWeight: '600' as const },
  small: { fontSize: 13, fontWeight: '600' as const },

  // ── Annotations ────────────────────────────────────────────
  caption: { fontSize: 12, fontWeight: '500' as const },
  label:   { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.1 },

  // ── Composants ─────────────────────────────────────────────
  chip:    { fontSize: 13, fontWeight: '700' as const },
  tab:     { fontSize: 10, fontWeight: '700' as const },
  badge:   { fontSize: 12, fontWeight: '700' as const },
} as const;

export type Typography = typeof typography;
