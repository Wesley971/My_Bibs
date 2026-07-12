// Design tokens synchronisés depuis "My Bibs Design System" (claude.ai/design)

// Cuivre désaturé — base de accentCopper ET de toute la famille "bas" (badges
// qty ≤ 75 ml). Isolé en constante pour que lowBg/lowText en dérivent
// réellement au lieu de dupliquer le hex à la main (cf. fusion des verts
// success/goodText, même principe).
const COPPER = '#C99383' as const;

function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export const colors = {
  // ── Fonds ──────────────────────────────────────────────────
  bg:     '#16213E', // fond principal de l'app
  card:   '#1F2B47', // cartes / lignes de liste
  card2:  '#232B45', // bouton − (ajout biberon)
  navBg:  '#0f1628', // barre de navigation basse

  // ── Accent lavande + palette élargie ───────────────────────
  accent:       '#A78BFA', // violet — LA touche : CTA, focus, la seule couleur "décorative"
  acL:          '#C4B5FD', // violet clair (unités, labels secondaires)
  accentCopper: COPPER, // cuivre désaturé — second accent chaud, réservé aux détails/alerte

  // ── Texte ──────────────────────────────────────────────────
  text:   '#F8F8FF', // texte principal (blanc cassé)
  muted:  '#7d8aa3', // texte secondaire / placeholders

  // ── Bordures : quasi invisibles, réservées aux champs de saisie ──
  border: 'rgba(255,255,255,0.08)',

  // ── Icon circle (IconButton variant par défaut) — plat, pas de dégradé card ──
  iconCircleBg: 'rgba(255,255,255,0.05)',

  // ── Starfield — couleur exacte du starfield de référence ──
  star: '#C9C2E8',

  // ── Sémantique : un seul ton désaturé par concept ──────────
  success: '#B7CDB1', // sauge désaturée (biberon enregistré)
  error:   '#C97C7C', // rouge désaturé (suppression)

  // ── QtyBadge — seuils quantité (un ton chacun, plus de bordure dure) ──
  goodBg:   'rgba(183,205,177,0.13)', // qty ≥ 130 ml
  goodText: '#B7CDB1',
  lowBg:    hexToRgba(COPPER, 0.15), // qty ≤ 75 ml — dérivé de accentCopper
  lowText:  COPPER, // = accentCopper

  // ── Texte sur fonds accentués — bleu-nuit, plus doux que le blanc pur ──
  textOnAccent: '#16213E',

  // ── Accent lavande — variantes opaques ──────────────────────
  accentDim:    'rgba(167,139,250,0.25)', // point de pagination inactif
  accentSubtle: 'rgba(167,139,250,0.15)', // fond badge jour / mini-progress
  progressBg:   'rgba(255,255,255,0.07)', // piste de la barre de progression
  accentGhost:  'rgba(167,139,250,0.05)', // fond du cadre QR (quasi transparent)
} as const;

export type Colors = typeof colors;
