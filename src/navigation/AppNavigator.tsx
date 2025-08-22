import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import GuideScreen from '../screens/GuideScreen';
import AboutScreen from '../screens/AboutScreen';

// Import components
import TabIcon from '../components/TabIcon';

const Tab = createBottomTabNavigator();

// Create tab bar icon function
const createTabBarIcon = (routeName: string) => {
  return ({ focused }: { focused: boolean }) => {
    return <TabIcon routeName={routeName} focused={focused} />;
  };
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: createTabBarIcon(route.name),
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
            shadowColor: '#8B5CF6',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarLabel: 'Beranda',
          }}
        />
        <Tab.Screen 
          name="Guide" 
          component={GuideScreen}
          options={{
            tabBarLabel: 'Panduan',
          }}
        />
        <Tab.Screen 
          name="About" 
          component={AboutScreen}
          options={{
            tabBarLabel: 'Tentang',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
