import { Text, View, Pressable } from "react-native";
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
  const { endpoint } = route.params.endpoint;
  const [errorMessage, setErrorMessage] = useState(null);
  const formButtonScale = useSharedValue(1);

  const submitToken = async () => {
    if (tokenInput.code.length !== 6) {
      const badCode = ({}["code"] = "Code must be 6 digits");
      setErrorMessage(badCode);
      return;
    }
    const res = await Client.post(`user/submit-token`, tokenInput);

    // Client.post(`user/${endpoint}`, tokenInput).catch((err) => {
    //   console.log(err);
    // });
  };

  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text
        style={{
          marginTop: height * 0.4,
          textAlign: "center",
        }}
      >
        Secure Token
      </Text>
      <InputField
        name="code"
        label="Code"
        keyboardType={"number-pad"}
        error={errorMessage}
        setValue={(text) => {
          setTokenInput({ ...tokenInput, code: text });
        }}
      />

      <Animated.View
        style={formButtonAnimatedStyle}
        // style={{
        //   transform: [{ scale: formButtonScale.value }],
        // }}
      >
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
  );
};

export default SecureToken;
