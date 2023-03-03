import React from "react";
import { View, Text, Pressable } from "react-native";
import { CameraView } from "./Camera";
import { Client } from "../../utils/connection";
import styles from "../../styles";

const Logger = ({ navigation }) => {
  return (
    <View>
      <Pressable
        style={styles.formButton}
        onPress={async () => {
          navigation.navigate("CameraView");
        }}
      >
        <Text style={styles.buttonText}>Camera</Text>
      </Pressable>
      <Pressable
        style={styles.formButton}
        onPress={async () => {
          navigation.navigate("Catches");
        }}
      >
        <Text style={styles.buttonText}>All Catches</Text>
      </Pressable>
    </View>
  );
};

export default Logger;
