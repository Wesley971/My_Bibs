import { Platform } from 'react-native';

export const fonts = {
  regular:   'Nunito_400Regular',
  semiBold:  'Nunito_600SemiBold',
  bold:      'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
} as const;

// Fallback système si Nunito n'est pas encore chargé
const systemFont = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });

export const fontFamily = systemFont;

export const typography = {
  // ── Grands chiffres ────────────────────────────────────────
  display: { fontFamily: fonts.extraBold, fontSize: 40, fontWeight: '900' as const, letterSpacing: -0.5 },
  hero:    { fontFamily: fonts.extraBold, fontSize: 64, fontWeight: '900' as const, lineHeight: 64 },
  total:   { fontFamily: fonts.extraBold, fontSize: 56, fontWeight: '900' as const, lineHeight: 56 },

  // ── Titres ─────────────────────────────────────────────────
  h2:    { fontFamily: fonts.extraBold, fontSize: 28, fontWeight: '900' as const },
  h3:    { fontFamily: fonts.extraBold, fontSize: 20, fontWeight: '800' as const },
  title: { fontFamily: fonts.extraBold, fontSize: 17, fontWeight: '800' as const },

  // ── Corps ──────────────────────────────────────────────────
  body:  { fontFamily: fonts.semiBold, fontSize: 15, fontWeight: '600' as const },
  bodyS: { fontFamily: fonts.semiBold, fontSize: 14, fontWeight: '600' as const },
  small: { fontFamily: fonts.semiBold, fontSize: 13, fontWeight: '600' as const },

  // ── Annotations ────────────────────────────────────────────
  caption: { fontFamily: fonts.regular,  fontSize: 12, fontWeight: '500' as const },
  label:   { fontFamily: fonts.bold,     fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.1 },

  // ── Composants ─────────────────────────────────────────────
  chip:    { fontFamily: fonts.bold,      fontSize: 13, fontWeight: '700' as const },
  tab:     { fontFamily: fonts.bold,      fontSize: 10, fontWeight: '700' as const },
  badge:   { fontFamily: fonts.bold,      fontSize: 12, fontWeight: '700' as const },
} as const;

export type Typography = typeof typography;
