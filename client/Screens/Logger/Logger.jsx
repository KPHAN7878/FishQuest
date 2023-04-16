import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import styles, { height, width } from "../../styles";
import { AnimatedButton } from "../../Components/Button";

const Logger = ({ navigation }) => {
  const ToCamera = (
    <View style={myStyles.container}>
      <AnimatedButton
        next={() => {
          navigation.navigate("CameraView");
        }}
        style={{ borderBottomWidth: 1, borderColor: "lightgray" }}
      >
        <View
          style={[
            styles.buttonContainer,
            {
              backgroundColor: "white",
              padding: 10,
              paddingBottom: 15,
              maxHeight: height * 0.1,
            },
          ]}
        >
          <Text
            style={{ color: "", fontSize: 24, textAlign: "center", flex: 1 }}
          >
            {"Submit a Catch"}
          </Text>
        </View>
      </AnimatedButton>
    </View>
  );
  return <View style={myStyles.parentContainer}>{ToCamera}</View>;
};

const myStyles = StyleSheet.create({
  button: {
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

export default Logger;
