import React from 'react';
import Svg, { Circle, Defs, G, Line, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({ width = 50, height = 50 }: LogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      {/* Background circle */}
      <Circle cx="100" cy="100" r="95" fill="#F4A460" opacity="0.15" />
      
      {/* Sun rays inspired by college logo */}
      <G transform="translate(100, 100)">
        {/* Outer rays (8 directions) */}
        <Path d="M 0,-75 L -10,-55 L 10,-55 Z" fill="#D2691E" />
        <Path d="M 0,-75 L -10,-55 L 10,-55 Z" fill="#D2691E" transform="rotate(45)" />
        <Path d="M 0,-75 L -10,-55 L 10,-55 Z" fill="#D2691E" transform="rotate(90)" />
        <Path d="M 0,-75 L -10,-55 L 10,-55 Z" fill="#D2691E" transform="rotate(135)" />
        <Path d="M 0,-75 L -10,-55 L 10,-55 Z" fill="#D2691E" transform="rotate(180)" />
        <Path d="M 0,-75 L -10,-55 L 10,-55 Z" fill="#D2691E" transform="rotate(225)" />
        <Path d="M 0,-75 L -10,-55 L 10,-55 Z" fill="#D2691E" transform="rotate(270)" />
        <Path d="M 0,-75 L -10,-55 L 10,-55 Z" fill="#D2691E" transform="rotate(315)" />
      </G>
      
      {/* Central sun circle with gradient */}
      <Defs>
        <RadialGradient id="sunGradient">
          <Stop offset="0%" stopColor="#F4A460" stopOpacity="1" />
          <Stop offset="100%" stopColor="#D2691E" stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Circle cx="100" cy="100" r="50" fill="url(#sunGradient)" />
      
      {/* Social network connection design */}
      <G transform="translate(100, 100)">
        {/* Open book pages */}
        <Path d="M -30,-18 Q -30,-28 -18,-28 L -3,-28 L -3,18 L -18,18 Q -30,18 -30,8 Z" fill="#fff" opacity="0.95" />
        <Path d="M 30,-18 Q 30,-28 18,-28 L 3,-28 L 3,18 L 18,18 Q 30,18 30,8 Z" fill="#fff" opacity="0.95" />
        
        {/* Central spine */}
        <Rect x="-2" y="-28" width="4" height="46" fill="#fff" opacity="0.9" />
        
        {/* Network nodes */}
        <Circle cx="-15" cy="-8" r="3.5" fill="#D2691E" />
        <Circle cx="15" cy="-8" r="3.5" fill="#D2691E" />
        <Circle cx="-15" cy="8" r="3.5" fill="#D2691E" />
        <Circle cx="15" cy="8" r="3.5" fill="#D2691E" />
        <Circle cx="0" cy="0" r="4" fill="#D2691E" />
        
        {/* Connection lines forming social network */}
        <Line x1="-15" y1="-8" x2="0" y2="0" stroke="#D2691E" strokeWidth="2" opacity="0.6" />
        <Line x1="15" y1="-8" x2="0" y2="0" stroke="#D2691E" strokeWidth="2" opacity="0.6" />
        <Line x1="-15" y1="8" x2="0" y2="0" stroke="#D2691E" strokeWidth="2" opacity="0.6" />
        <Line x1="15" y1="8" x2="0" y2="0" stroke="#D2691E" strokeWidth="2" opacity="0.6" />
      </G>
    </Svg>
  );
}