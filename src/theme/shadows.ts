import { Platform } from 'react-native';
import { colors } from './colors';

// react-native-web's Platform.select only recognizes an explicit `web` key —
// it does NOT fall through ios/android branches, so every token here needs
// its own CSS boxShadow, or the shadow silently disappears on web.

// Élévation douce et diffuse — toutes les cartes et surfaces flottantes,
// remplace les bordures dures.
// Référence (web) : 0 22px 44px -18px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.25)
export const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
  },
  android: { elevation: 10 },
  web: { boxShadow: '0 22px 44px -18px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.25)' },
  default: {},
});

// Ombre d'accent — CTA principal uniquement, jamais sur les cartes.
// Référence (web) : 0 10px 26px -8px rgba(167,139,250,0.5)
// iOS : offset centré {0,0} (halo, pas une ombre décalée) + shadowRadius
// large / shadowOpacity modérée — un radius trop faible avec une opacity
// trop haute produit un bord dur au lieu d'un fondu progressif.
// Android : elevation ignore totalement shadowColor (toujours un gris/noir
// neutre) — impossible d'obtenir un halo violet par ce seul biais, d'où la
// couche de halo peinte à la main (dégradé radial SVG) dans AccentGlow.tsx.
export const accentShadow = Platform.select({
  ios: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 28,
  },
  android: { elevation: 8 },
  web: { boxShadow: '0 10px 26px -8px rgba(167,139,250,0.5)' },
  default: {},
});

// Variante plus discrète — IconButton accent (stepper "+", FAB de la tab bar).
// Référence (web) : 0 8px 18px -8px rgba(167,139,250,0.45)
// Même logique que accentShadow : offset centré + radius large / opacity modérée.
export const accentShadowSoft = Platform.select({
  ios: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  android: { elevation: 6 },
  web: { boxShadow: '0 8px 18px -8px rgba(167,139,250,0.45)' },
  default: {},
});

// Variante la plus discrète — badges/pilules accent (QtyBadge neutre, badge total
// du jour, chip "Maintenant", point d'étape actif) : même halo, intensité minimale.
// Référence (web) : 0 4px 10px -4px rgba(167,139,250,0.3)
export const accentShadowSubtle = Platform.select({
  ios: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  android: { elevation: 3 },
  web: { boxShadow: '0 4px 10px -4px rgba(167,139,250,0.3)' },
  default: {},
});

// Icon circle (IconButton variant par défaut) — élévation plus légère que les cartes.
// Référence (web) : 0 8px 18px -8px rgba(0,0,0,0.5)
export const iconButtonShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 13,
  },
  android: { elevation: 4 },
  web: { boxShadow: '0 8px 18px -8px rgba(0,0,0,0.5)' },
  default: {},
});
