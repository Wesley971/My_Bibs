export const fonts = {
  regular:   'Nunito_400Regular',
  semiBold:  'Nunito_600SemiBold',
  bold:      'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  display:   'Spectral_500Medium', // réservée aux grands chiffres hero (Total du jour)
} as const;

// Échelle consolidée — 7 tailles, sans doublons (design system My Bibs)
export const typography = {
  hero:    { fontFamily: fonts.display,   fontSize: 52, fontWeight: '500' as const, lineHeight: 52 },
  display: { fontFamily: fonts.display,   fontSize: 44, fontWeight: '500' as const, lineHeight: 44 },
  h1:      { fontFamily: fonts.extraBold, fontSize: 24, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2:      { fontFamily: fonts.extraBold, fontSize: 19, fontWeight: '800' as const },
  body:    { fontFamily: fonts.semiBold,  fontSize: 15, fontWeight: '600' as const },
  small:   { fontFamily: fonts.semiBold,  fontSize: 13, fontWeight: '600' as const },
  label:   { fontFamily: fonts.bold,      fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.1 },
} as const;

export type Typography = typeof typography;
