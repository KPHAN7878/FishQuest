import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Profile from "../User/Profile";
import MAP from "./Map";
import Logger from "../Logger/Logger";
import { CameraView } from "../Logger/Camera";

const Tabs = createBottomTabNavigator();

const Home = () => {
  return (
    <Tabs.Navigator screenOptions={{ initialRouteName: "Map" }}>
      <Tabs.Screen name="Map" component={MAP} />
      <Tabs.Screen name="Logger" component={Logger} />
      <Tabs.Screen name="Profile" component={Profile} />
    </Tabs.Navigator>
  );
};

export default Home;
