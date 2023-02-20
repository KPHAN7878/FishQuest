import Login from "./Screens/User/Login";
import Profile from "./Screens/User/Profile";
import SecureToken from "./Screens/User/SecureToken";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StartScreen } from "./Screens/StartScreen";
import Home from "./Screens/Social/Home";
import MAP from "./Screens/Social/Map";
import Logger from "./Screens/Logger/Logger";

import React, { useState } from "react";
import { UserContext } from "./Contexts/UserContext";
import { CameraView } from "./Screens/Logger/Camera";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Map" component={MAP} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Logger" component={Logger} />
          <Stack.Screen name="CameraView" component={CameraView} />

          <Stack.Screen
            name="SecureToken"
            component={SecureToken}
            screenOptions={{ gestureEnabled: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
