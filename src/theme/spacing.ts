// Espacements extraits des paddings/margins du design HTML
export const spacing = {
  sm:   8,  // gap chips / petits écarts
  md:   12, // padding lignes de liste
  lg:   16, // padding horizontal standard (sections)
  xl:   20, // padding cartes
  xxl:  22, // margin bottom cartes
  xxxl: 28, // padding bottom scroll / nav
} as const;

export type Spacing = typeof spacing;
