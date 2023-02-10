import { Text, View } from "react-native";
import React from "react";
import { Client } from "../utils/connection";
import styles, { width, height } from "../styles";

export const StartScreen = ({ navigation }) => {
  Client.get("user/status")
    .then((res) => {
      navigation.navigate("Profile");
    })
    .catch((err) => {
      if (err.response.status === 403) navigation.navigate("Login");
    });
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text
        style={{
          marginTop: height * 0.15,
          textAlign: "center",
        }}
      >
        Loading...
      </Text>
    </View>
  );
};
