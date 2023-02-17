import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Profile from '../User/Profile'
import MAP from './Map';
import Logger from './Logger';


const Tabs = createBottomTabNavigator();

const Home = () => {
  return (
    // <div>Home</div>
    //<Tabs.Navigator screenOptions={{headerShown: false}} initialRouteName="Map">
    <Tabs.Navigator screenOptions={{headerShown: true, initialRouteName:"Map"}} >
        <Tabs.Screen name="Map" component={MAP} />
        <Tabs.Screen name="Logger" component={Logger} />
        <Tabs.Screen name="Profile" component={Profile} />
    </Tabs.Navigator>
  )
}

export default Home