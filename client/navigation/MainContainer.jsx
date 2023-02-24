import * as React from 'react';
import { Dimensions} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';


//Screens
import HomeScreen from '../Screens/Social/SocialFeed';
import MapScreen from "../Screens/Map/Map";
import LoggerScreen from "../Screens/Logger/Logger";
import MissionsScreen from "../Screens/Missions/Missions";
import ProfileScreen from "../Screens/User/Profile";



const Tab = createBottomTabNavigator();

// Navigation Bar
export default function MainContainer(){    
    return(
        <Tab.Navigator
            initialRouteName= {"Social"}
            screenOptions={{
                tabBarActiveTintColor: '#3366ff',
                tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
                tabBarStyle: { padding: 10, height: Dimensions.get('window').height * 0.1 },

            }}
            >
            <Tab.Screen
                name= "Social"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Map',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="map-marker" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="CatchLogger"
                component={LoggerScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Catch',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="camera" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Missions"
                component={MissionsScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Missions',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="trophy" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }}
            />
            </Tab.Navigator>
    )
}