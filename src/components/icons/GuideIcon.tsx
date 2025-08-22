import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface GuideIconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

const GuideIcon: React.FC<GuideIconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  focused = false 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Book cover */}
      <Path 
        d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" 
        stroke={color} 
        strokeWidth="2" 
        fill={focused ? color : "none"}
        fillOpacity={focused ? 0.1 : 0}
      />
      
      {/* Book spine */}
      <Path 
        d="M8 4V20" 
        stroke={color} 
        strokeWidth="2"
      />
      
      {/* Guide pages/lines */}
      <Path 
        d="M11 8H17" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
        opacity={focused ? 1 : 0.8}
      />
      <Path 
        d="M11 11H17" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
        opacity={focused ? 1 : 0.8}
      />
      <Path 
        d="M11 14H15" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
        opacity={focused ? 1 : 0.8}
      />
      
      {/* Bookmark/ribbon */}
      <Path 
        d="M16 4V12L14 10L12 12V4" 
        stroke={color} 
        strokeWidth="1.5" 
        fill={color} 
        fillOpacity={focused ? 0.3 : 0.2}
      />
      
      {/* Guide compass icon */}
      <Circle 
        cx="6" 
        cy="8" 
        r="1" 
        stroke={color} 
        strokeWidth="1" 
        fill="none"
        opacity={focused ? 1 : 0.7}
      />
      <Path 
        d="M5.5 7.5L6.5 8.5" 
        stroke={color} 
        strokeWidth="1" 
        strokeLinecap="round"
        opacity={focused ? 1 : 0.7}
      />
    </Svg>
  );
};

export default GuideIcon;
