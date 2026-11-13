import React from 'react';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '../../theme/tokens';

/**
 * Logo: kart destesi — doğan güneşli neon kart, arkasında yelpaze gibi iki kart.
 * Uygulama ikonu ve açılış ekranıyla aynı şekiller (assets/icon-source.svg).
 * Renkli zeminlerde arka kart zeminle aynı renge düşerse `backLeft`/`backRight` değiştirilir.
 */
export function DeckLogo({
  size = 132,
  front = colors.accent,
  backLeft = colors.pink,
  backRight = colors.yellow,
  ink = colors.ink,
}: {
  size?: number;
  front?: string;
  backLeft?: string;
  backRight?: string;
  ink?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="92 120 840 840"
      accessibilityLabel="Şafak Sayar logosu"
    >
      <Rect
        x={282}
        y={250}
        width={460}
        height={560}
        rx={104}
        fill={backLeft}
        transform="rotate(-17 512 940)"
      />
      <Rect
        x={282}
        y={250}
        width={460}
        height={560}
        rx={104}
        fill={backRight}
        transform="rotate(15 512 940)"
      />
      <Rect x={262} y={222} width={500} height={580} rx={110} fill={front} />
      <Path d="M362 590 A150 150 0 0 1 662 590 Z" fill={ink} />
      <Rect x={332} y={622} width={360} height={40} rx={20} fill={ink} />
      <Rect x={402} y={690} width={220} height={40} rx={20} fill={ink} />
      <Rect x={496} y={350} width={32} height={76} rx={16} fill={ink} />
      <Rect
        x={496}
        y={350}
        width={32}
        height={76}
        rx={16}
        fill={ink}
        transform="rotate(-45 512 590)"
      />
      <Rect
        x={496}
        y={350}
        width={32}
        height={76}
        rx={16}
        fill={ink}
        transform="rotate(45 512 590)"
      />
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
