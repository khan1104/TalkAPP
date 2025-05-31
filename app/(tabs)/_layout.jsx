import React from 'react';
import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tablayout = () => {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#4CAF50",  // Green active tab color
      tabBarInactiveTintColor: "#B0B0B0", // Grey inactive tab color
      tabBarStyle: {
        backgroundColor: "#2f3030",  // Dark background color for the tab bar
        height: 75,
        borderTopStartRadius: 17,
        borderTopEndRadius: 17,
        paddingBottom:10, // Add padding to bottom for better space
      },
      tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: '600',
      },
      tabBarItemStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:5
      },
      tabBarIconStyle: {
        marginBottom: 5, // Ensure some space between the icon and label
      },
    }}
  >
    <Tabs.Screen
      name="chats"
      options={{
        headerShown: false,
        title: "Chats",
        tabBarIcon: ({ color, focused }) => (
          <MaterialIcons
            name="message"
            size={focused ? 30 : 30}
            color={color}
            //style={{ transform: [{ scale: focused ? 1 : 1 }] }} // Add slight scale animation
          />
        ),
      }}
    />
    <Tabs.Screen
      name="settings"
      options={{
        headerShown: false,
        title: "Settings",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name="settings"
            size={focused ? 30 : 30}
            color={color}
            //style={{ transform: [{ scale: focused ? 1 : 1 }] }} // Add slight scale animation
          />
        ),
      }}
    />
  </Tabs>
  );
};

export default Tablayout;