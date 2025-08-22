import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import HomeIcon from './icons/HomeIcon';
import GuideIcon from './icons/GuideIcon';
import AboutIcon from './icons/AboutIcon';

interface TabIconProps {
  routeName: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ routeName, focused }) => {
  const getIcon = (route: string) => {
    const iconColor = focused ? '#8B5CF6' : '#9CA3AF';
    const iconSize = focused ? 26 : 24;
    
    switch (route) {
      case 'Home':
        return <HomeIcon size={iconSize} color={iconColor} focused={focused} />;
      case 'Guide':
        return <GuideIcon size={iconSize} color={iconColor} focused={focused} />;
      case 'About':
        return <AboutIcon size={iconSize} color={iconColor} focused={focused} />;
      default:
        return <HomeIcon size={iconSize} color={iconColor} focused={focused} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer,
        focused && styles.iconContainerActive
      ]}>
        {getIcon(routeName)}
      </View>
      <Text style={[
        styles.tabIconText,
        focused && styles.tabIconTextActive
      ]}>
        {routeName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minHeight: 60,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
  },
  iconContainerActive: {
    transform: [{ scale: 1.1 }],
    opacity: 1,
  },
  tabIconText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  tabIconTextActive: {
    color: '#8B5CF6',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default TabIcon;
