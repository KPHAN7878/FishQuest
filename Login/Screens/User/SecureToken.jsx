import { Text, View, Pressable, ScrollView, Keyboard } from "react-native";
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
  const { pretext, endpoint, username, tokenType } = route.params;
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSecure, setIsSecure] = useState(false);
  const [tokenInput, setTokenInput] = useState({
    code: "",
    tokenType,
    username,
  });
  const [field, setField] = useState("");
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
        setIsSecure(true);
      }
    }
  };

  const submitChange = async () => {
    const fieldWithToken = {
      ...tokenInput,
      [tokenType]: field,
    };

    const res = await Client.post(`user/${endpoint}`, fieldWithToken);
    if (res?.data.errors) {
      const errors = toErrorMap(res.data.errors);
      setErrorMessage(errors);
      return;
    } else {
      setErrorMessage(null);
      navigation.navigate(route.params.goBack);
    }
  };

  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });

  const tokenField = (
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
  );

  const secureChange = (
    <View>
      <InputField
        name={tokenType}
        label={`Enter new ${tokenType}`}
        error={errorMessage}
        setValue={(text) => {
          setField(text);
        }}
      />
    </View>
  );

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          flex: 1,
          marginTop: height * 0.35,
        }}
      >
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          {isSecure ? secureChange : tokenField}
          <Text
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.interactiveText}
          >
            Cancel
          </Text>
        </Pressable>

        <Animated.View style={formButtonAnimatedStyle}>
          <Pressable
            style={styles.formButton}
            onPress={() => {
              formButtonScale.value = withSequence(
                withSpring(1.5),
                withSpring(1)
              );
              isSecure ? submitChange() : submitToken();
            }}
          >
            <Text style={styles.buttonText}>
              {isSecure ? `Submit ${tokenType}` : "Submit token"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default SecureToken;
