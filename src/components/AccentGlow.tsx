import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

// Android's `elevation` shadow ignores shadowColor entirely (always renders a
// neutral black/grey Material shadow), so any violet CTA/badge halo needs an
// explicit painted backdrop there. A real radial gradient (not stacked
// flat-opacity rings — those read as hard concentric edges, not a fade)
// gives a genuinely diffuse falloff, matching how shadowRadius/box-shadow
// blur works natively on iOS/web.

export type GlowIntensity = 'strong' | 'soft' | 'subtle';

// Bleed (blur reach, px) + opacity falloff per tier — mirrors the iOS/web
// accentShadow / accentShadowSoft / accentShadowSubtle tokens in
// theme/shadows.ts, proportioned to the element's visual weight
// (small badge < secondary control < main CTA).
const TIERS: Record<GlowIntensity, { bleed: number; stops: [string, number][] }> = {
  strong: { bleed: 26, stops: [['0%', 0.5],  ['40%', 0.32], ['70%', 0.14], ['100%', 0]] },
  soft:   { bleed: 20, stops: [['0%', 0.4],  ['40%', 0.26], ['70%', 0.11], ['100%', 0]] },
  subtle: { bleed: 10, stops: [['0%', 0.3],  ['40%', 0.18], ['70%', 0.07], ['100%', 0]] },
};

type Props = {
  borderRadius: number;
  intensity?: GlowIntensity;
  /** Dimensions explicites (px) — uniquement pour les hôtes dont la taille n'est
   *  connue qu'après layout (ex: bouton `width:'100%'`, mesuré via onLayout).
   *  Omises, le halo se dimensionne automatiquement sur son parent (inset négatif). */
  width?: number;
  height?: number;
};

/** Halo violet diffus peint à la main — Android uniquement, voir accentShadow* dans theme/shadows.ts. */
export function AccentGlow({ borderRadius, intensity = 'strong', width, height }: Props) {
  const { bleed, stops } = TIERS[intensity];
  const gradientId = `accentGlow-${intensity}`;
  const hasExplicitSize = width != null && height != null;

  return (
    <View
      pointerEvents="none"
      style={
        hasExplicitSize
          ? { position: 'absolute', left: -bleed, top: -bleed, width: width! + bleed * 2, height: height! + bleed * 2 }
          : { position: 'absolute', top: -bleed, left: -bleed, right: -bleed, bottom: -bleed }
      }
    >
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            {stops.map(([offset, opacity]) => (
              <Stop key={offset} offset={offset} stopColor={colors.accent} stopOpacity={opacity} />
            ))}
          </RadialGradient>
        </Defs>
        <Rect
          x={0} y={0} width="100%" height="100%"
          rx={borderRadius + bleed} ry={borderRadius + bleed}
          fill={`url(#${gradientId})`}
        />
      </Svg>
    </View>
  );
}
