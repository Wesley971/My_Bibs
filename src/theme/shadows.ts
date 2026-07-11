import { Platform } from 'react-native';
import { colors } from './colors';

// Élévation douce et diffuse — toutes les cartes et surfaces flottantes,
// remplace les bordures dures.
export const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  android: { elevation: 6 },
  default: {},
});

// Ombre d'accent — CTA principal uniquement, jamais sur les cartes.
export const accentShadow = Platform.select({
  ios: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 11,
  },
  android: { elevation: 8 },
  default: {},
});

// Variante plus discrète — IconButton accent (stepper "+", FAB de la tab bar).
export const accentShadowSoft = Platform.select({
  ios: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  android: { elevation: 6 },
  default: {},
});
