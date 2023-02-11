import { Text, View, Pressable, ScrollView } from "react-native";
import styles, { width, height } from "../../styles";
import { Client } from "../../utils/connection";
import React, { useState } from "react";
import { InputField } from "../../Components/InputField";

import Animated, {
  withSequence,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { toErrorMap } from "../../utils/toErrorMap";

export const SecureToken = ({ route, navigation }) => {
  const [tokenInput, setTokenInput] = useState({
    code: "",
    ...route.params.tokenInput,
  });
  const { endpoint, pretext } = route.params;
  const [errorMessage, setErrorMessage] = useState(null);
  const formButtonScale = useSharedValue(1);

  const submitToken = async () => {
    const badCode = {};

    if (tokenInput.code.length !== 6) {
      badCode["code"] = "Code must be 6 digits";
      setErrorMessage(badCode);
      return;
    } else {
      setErrorMessage(null);
    }

    const res = await Client.post(`user/submit-token`, tokenInput);
    if (res) {
      if (res?.data.errors) {
        const errors = toErrorMap(res.data.errors);
        setErrorMessage(errors);
        return;
      } else {
        setErrorMessage(null);
      }
    }

    // const token = await Client.post(`user/${endpoint}`, tokenInput);
  };

  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          flex: 1,
          marginTop: height * 0.4,
        }}
      >
        <InputField
          name="code"
          label="_ _ _ _ _ _"
          pretext={pretext}
          keyboardType={"number-pad"}
          error={errorMessage}
          setValue={(text) => {
            setTokenInput({ ...tokenInput, code: text });
          }}
          style={{
            fontWeight: "bold",
            fontSize: 32,
            textAlign: "center",
            letterSpacing: 8,
          }}
          maxLength={6}
        />

        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.interactiveText}>Cancel</Text>
        </Pressable>
        <Animated.View style={formButtonAnimatedStyle}>
          <Pressable
            style={styles.formButton}
            onPress={() => {
              formButtonScale.value = withSequence(
                withSpring(1.5),
                withSpring(1)
              );
              submitToken();
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default SecureToken;
