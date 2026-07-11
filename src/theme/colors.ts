// Design tokens synchronisés depuis "My Bibs Design System" (claude.ai/design)
export const colors = {
  // ── Fonds ──────────────────────────────────────────────────
  bg:     '#16213E', // fond principal de l'app
  card:   '#1F2B47', // cartes / lignes de liste
  card2:  '#232B45', // bouton − (ajout biberon)
  navBg:  '#0f1628', // barre de navigation basse

  // ── Accent lavande + palette élargie ───────────────────────
  accent:       '#A78BFA', // violet — LA touche : CTA, focus, la seule couleur "décorative"
  acL:          '#C4B5FD', // violet clair (unités, labels secondaires)
  accentCopper: '#C99383', // cuivre désaturé — second accent chaud, réservé aux détails/alerte
  accentDeep:   '#6D5AAE', // violet profond — arrière-plans très discrets uniquement

  // ── Texte ──────────────────────────────────────────────────
  text:   '#F8F8FF', // texte principal (blanc cassé)
  muted:  '#7d8aa3', // texte secondaire / placeholders

  // ── Bordures : quasi invisibles, réservées aux champs de saisie ──
  border: 'rgba(255,255,255,0.08)',

  // ── Sémantique : un seul ton désaturé par concept ──────────
  success: '#B7CDB1', // sauge désaturée (biberon enregistré)
  alert:   '#C99383', // cuivre désaturé (= accentCopper)
  error:   '#C97C7C', // rouge désaturé (suppression)

  // ── QtyBadge — seuils quantité (un ton chacun, plus de bordure dure) ──
  goodBg:   'rgba(183,205,177,0.13)', // qty ≥ 130 ml
  goodBdr:  'transparent',
  goodText: '#B7CDB1',
  lowBg:    'rgba(201,147,131,0.15)', // qty ≤ 75 ml
  lowBdr:   'transparent',
  lowText:  '#D9A98B',

  // ── Texte sur fonds accentués — bleu-nuit, plus doux que le blanc pur ──
  textOnAccent: '#16213E',

  // ── Accent lavande — variantes opaques ──────────────────────
  accentBdr:    'rgba(167,139,250,0.35)', // bordure de badge neutre
  accentDim:    'rgba(167,139,250,0.25)', // point de pagination inactif
  accentSubtle: 'rgba(167,139,250,0.15)', // fond badge jour / mini-progress
  progressBg:   'rgba(255,255,255,0.07)', // piste de la barre de progression
  accentGhost:  'rgba(167,139,250,0.05)', // fond du cadre QR (quasi transparent)
} as const;

export type Colors = typeof colors;
