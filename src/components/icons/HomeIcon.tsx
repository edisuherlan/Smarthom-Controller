import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface HomeIconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

const HomeIcon: React.FC<HomeIconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  focused = false 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* House base */}
      <Path 
        d="M3 12L12 3L21 12" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* House structure */}
      <Path 
        d="M5 12V19C5 19.5523 5.44772 20 6 20H9V14H15V20H18C18.5523 20 19 19.5523 19 19V12" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill={focused ? color : "none"}
        fillOpacity={focused ? 0.1 : 0}
      />
      
      {/* Door */}
      <Path 
        d="M9 20V14H15V20" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Chimney */}
      <Path 
        d="M16 5L16 8L18 6" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity={focused ? 1 : 0.7}
      />
      
      {/* Heart symbol (for care/medical) */}
      <Circle 
        cx="12" 
        cy="9" 
        r="1" 
        fill={color} 
        opacity={focused ? 1 : 0.8}
      />
    </Svg>
  );
};

export default HomeIcon;
