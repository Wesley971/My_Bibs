// Rayons harmonisés — 5 valeurs (remplace les valeurs dispersées précédentes)
export const radius = {
  sm:   12, // badges, chips, petits inputs
  md:   16, // champs de texte, lignes de liste
  lg:   22, // cartes, boutons, conteneurs principaux
  pill: 999, // piste de progression, boutons pilule
} as const;

// Icon buttons / FAB : cercle parfait → radius = taille / 2
export const circleRadius = (size: number) => size / 2;
