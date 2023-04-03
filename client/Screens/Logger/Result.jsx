import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "../../styles";
import { height } from "../../styles";
import { toErrorMap } from "../../utils/toErrorMap";

const Result = ({ route, navigation }) => {
  const result = route.params;
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => {
    if (result.errors) {
      const errors = toErrorMap(result.errors);
      setErrorMessage(errors);
    }
  }, [setErrorMessage]);

  return result.errors ? (
    <View
      style={{
        marginTop: height * 0.15,
      }}
    >
      <Text style={styles.fieldError}>
        {errorMessage ? errorMessage["camera"] : "Something went wrong"}
      </Text>
      <Pressable
        style={styles.formButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={styles.buttonText}>{"Retake photo"}</Text>
      </Pressable>
    </View>
  ) : (
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
        {}
      </Text>

      <Pressable
        style={styles.formButton}
        onPress={() => {
          navigation.navigate("CreatePost", result);
        }}
      >
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
