// Design tokens extraits de "My Bibs.html" — Lavande & Brume
export const colors = {
  // ── Fonds ──────────────────────────────────────────────────
  bg:     '#16213E', // fond principal de l'app
  card:   '#1F2B47', // cartes / lignes de liste
  card2:  '#232B45', // bouton − (ajout biberon)
  navBg:  '#0f1628', // barre de navigation basse

  // ── Accent lavande ─────────────────────────────────────────
  accent: '#A78BFA', // violet principal (boutons, progress, actif)
  acL:    '#C4B5FD', // violet clair (unités, labels secondaires)

  // ── Texte ──────────────────────────────────────────────────
  text:   '#F8F8FF', // texte principal (blanc cassé)
  muted:  '#9CA3AF', // texte secondaire / placeholders

  // ── Bordures ───────────────────────────────────────────────
  border: 'rgba(167,139,250,0.18)', // bordures subtiles

  // ── Sémantique ─────────────────────────────────────────────
  success: '#34D399', // vert (biberon enregistré)
  error:   '#EF4444', // rouge (suppression)

  // ── QtyBadge — seuils quantité ─────────────────────────────
  goodBg:   'rgba(52,211,153,0.15)', // vert bg  (qty ≥ 130 ml)
  goodBdr:  'rgba(52,211,153,0.35)', // vert bdr
  goodText: '#6EE7B7',               // vert texte
  lowBg:    'rgba(251,146,60,0.15)', // orange bg  (qty ≤ 75 ml)
  lowBdr:   'rgba(251,146,60,0.35)', // orange bdr
  lowText:  '#FCA97D',               // orange texte

  // ── Texte sur fonds accentués ──────────────────────────────
  textOnAccent: '#FFFFFF',           // blanc pur sur boutons/chips actives

  // ── Accent lavande — variantes opaques ─────────────────────
  accentBdr:    'rgba(167,139,250,0.35)', // bordure badge neutre
  accentDim:    'rgba(167,139,250,0.25)', // dot pagination inactif
  accentSubtle: 'rgba(167,139,250,0.15)', // fond badge jour / mini-progress
  progressBg:   'rgba(167,139,250,0.12)', // piste barre de progression
  accentGhost:  'rgba(167,139,250,0.04)', // fond cadre QR (quasi-transparent)
} as const;

export type Colors = typeof colors;
