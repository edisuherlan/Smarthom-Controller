import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface AboutIconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

const AboutIcon: React.FC<AboutIconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  focused = false 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Info circle background */}
      <Circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke={color} 
        strokeWidth="2" 
        fill={focused ? color : "none"}
        fillOpacity={focused ? 0.1 : 0}
      />
      
      {/* Info "i" dot */}
      <Circle 
        cx="12" 
        cy="8" 
        r="1.5" 
        fill={color}
        opacity={focused ? 1 : 0.8}
      />
      
      {/* Info "i" line */}
      <Path 
        d="M12 12V16" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round"
        opacity={focused ? 1 : 0.8}
      />
      
      {/* Decorative elements around info */}
      <Circle 
        cx="6" 
        cy="6" 
        r="0.5" 
        fill={color} 
        opacity={focused ? 0.6 : 0.4}
      />
      <Circle 
        cx="18" 
        cy="6" 
        r="0.5" 
        fill={color} 
        opacity={focused ? 0.6 : 0.4}
      />
      <Circle 
        cx="6" 
        cy="18" 
        r="0.5" 
        fill={color} 
        opacity={focused ? 0.6 : 0.4}
      />
      <Circle 
        cx="18" 
        cy="18" 
        r="0.5" 
        fill={color} 
        opacity={focused ? 0.6 : 0.4}
      />
      
      {/* Additional info indicators */}
      <Path 
        d="M4 12H2" 
        stroke={color} 
        strokeWidth="1" 
        strokeLinecap="round"
        opacity={focused ? 0.5 : 0.3}
      />
      <Path 
        d="M22 12H20" 
        stroke={color} 
        strokeWidth="1" 
        strokeLinecap="round"
        opacity={focused ? 0.5 : 0.3}
      />
    </Svg>
  );
};

export default AboutIcon;
