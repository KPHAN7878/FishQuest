import Login from "./Screens/User/Login";
import SecureToken from "./Screens/User/SecureToken";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StartScreen } from "./Screens/StartScreen";
import { useFonts } from "expo-font";

import Home from "./Screens/Social/Home";

import React, { useState } from "react";
import { UserContext } from "./Contexts/UserContext";
import { CameraView } from "./Screens/Logger/Camera";
import Result from "./Screens/Logger/Result";
import CreatePost from "./Screens/Social/CreatePost";
import CommentContainer from "./Screens/Social/CommentContainer";
import Catches from "./Screens/Logger/Catches";
import CatchDetail from "./Screens/Logger/CatchDetail";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [fontsLoaded, error] = useFonts({
    Inter: require("./assets/fonts/Inter.ttf"),
    Inter_regular: require("./assets/fonts/Inter_regular.ttf"),
    Inter_medium: require("./assets/fonts/Inter_medium.ttf"),
    Allura: require("./assets/fonts/Allura.ttf"),
    Allura_regular: require("./assets/fonts/Allura_regular.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  //Other screens are in the 'navigation' tab
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <Stack.Group>
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Group>
          <Stack.Group>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CommentContainer" component={CommentContainer} />
          </Stack.Group>
          <Stack.Group>
            <Stack.Screen name="CameraView" component={CameraView} />
            <Stack.Screen name="Catches" component={Catches} />
            <Stack.Screen name="Result" component={Result} />
            <Stack.Screen name="CreatePost" component={CreatePost} />
            <Stack.Screen name="CatchDetail" component={CatchDetail} />
          </Stack.Group>
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
