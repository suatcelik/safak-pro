import React from 'react';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '../../theme/tokens';

/** Logo: ufuktan doğan güneş */
export function SunriseLogo({
  size = 132,
  bg = colors.accent,
  fg = colors.ink,
  rays = true,
}: {
  size?: number;
  bg?: string;
  fg?: string;
  rays?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 132 132" accessibilityLabel="Şafak Sayar logosu">
      <Circle cx={66} cy={66} r={66} fill={bg} />
      <Path d="M30 80 A36 36 0 0 1 102 80 Z" fill={fg} />
      <Rect x={22} y={86} width={88} height={7} rx={3.5} fill={fg} />
      <Rect x={38} y={99} width={56} height={7} rx={3.5} fill={fg} />
      {rays ? (
        <>
          <Rect x={63} y={22} width={6} height={16} rx={3} fill={fg} />
          <Rect
            x={30}
            y={38}
            width={6}
            height={14}
            rx={3}
            fill={fg}
            transform="rotate(-45 33 45)"
          />
          <Rect x={96} y={38} width={6} height={14} rx={3} fill={fg} transform="rotate(45 99 45)" />
        </>
      ) : null}
    </Svg>
  );
}

/** Boş durum: soru işaretli takvim */
export function EmptyCalendar({ width = 200 }: { width?: number }) {
  return (
    <Svg width={width} height={(width * 180) / 200} viewBox="0 0 200 180">
      <Rect
        x={40}
        y={34}
        width={120}
        height={132}
        rx={24}
        fill={colors.yellow}
        transform="rotate(-6 100 100)"
      />
      <Rect
        x={44}
        y={30}
        width={120}
        height={132}
        rx={24}
        fill={colors.surface}
        stroke={colors.border}
        strokeWidth={2}
      />
      <Rect x={44} y={30} width={120} height={36} rx={18} fill={colors.accent} />
      <Rect x={44} y={50} width={120} height={16} fill={colors.accent} />
      <Rect x={72} y={18} width={10} height={26} rx={5} fill={colors.white} />
      <Rect x={126} y={18} width={10} height={26} rx={5} fill={colors.white} />
      <SvgText
        x={104}
        y={136}
        textAnchor="middle"
        fontFamily={fonts.extrabold}
        fontSize={56}
        fill={colors.white}
      >
        ?
      </SvgText>
    </Svg>
  );
}

/** Hata durumu: güneşin önünde bulut */
export function ErrorCloud({ width = 200 }: { width?: number }) {
  return (
    <Svg width={width} height={(width * 180) / 200} viewBox="0 0 200 180">
      <Circle cx={120} cy={80} r={46} fill={colors.yellow} />
      <Path
        d="M44 142a30 30 0 0 1 6-59 40 40 0 0 1 76 6 26 26 0 0 1 22 53z"
        fill={colors.surfaceRaised}
        stroke={colors.border}
        strokeWidth={2}
      />
      <Path
        d="M84 104l24 24M108 104l-24 24"
        stroke={colors.dangerText}
        strokeWidth={8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
