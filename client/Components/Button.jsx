import { StyleSheet, TouchableHighlight } from "react-native";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { height, width } from "../styles";

export const AnimatedButton = (props) => {
  const buttonOpacity = useSharedValue(1);

  return (
    <TouchableHighlight
      underlayColor={"gray"}
      style={[myStyles.button, props.style]}
      onPress={() => {
        buttonOpacity.value = 1;
        props.next();
      }}
    >
      {props.children}
    </TouchableHighlight>
  );
};

const myStyles = StyleSheet.create({
  button: {
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },

  container: {
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flex: 1,
    position: "absolute",
    width,
    height: height * 0.1,
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  parentContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
