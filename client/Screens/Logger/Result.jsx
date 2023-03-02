import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "../../styles";
import { height } from "../../styles";

const Result = ({ route, navigation }) => {
  const result = route.params;
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
        {/* {JSON.stringify(result)} */}
      </Text>

      <Pressable style={styles.formButton} onPress={() => {
        navigation.navigate("CreatePost", result)
      }}>
        <Text style={styles.buttonText}>{"Post Catch"}</Text>
      </Pressable>
      <Pressable
        style={styles.formButton}
        onPress={() => {
          navigation.navigate("CatchLogger");
        }}
      >
        <Text style={styles.buttonText}>{"Continue"}</Text>
      </Pressable>
    </View>
  );
};

export default Result;
