import { Text, View, Pressable, ScrollView, Keyboard } from "react-native";
import styles, { width, height } from "../../styles";
import { Client } from "../../utils/connection";
import React, { useState, createRef, useEffect } from "react";
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

  const passwordRef = createRef();
  const tokenRef = createRef();

  useEffect(() => {
    if (tokenRef && !isSecure) {
      tokenRef.current.focus();
    } else if (passwordRef) {
      passwordRef.current.focus();
    }
  }, [tokenRef, passwordRef]);

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
      passwordRef.current?.focus();
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
      pretext={pretext}
      keyboardType={"number-pad"}
      maxLength={6}
      name={"code"}
      placeholder={"_ _ _ _ _ _"}
      error={errorMessage}
      onChangeText={(text) => {
        setTokenInput({ ...tokenInput, code: text });
      }}
      style={{
        ...styles.textInput,
        fontWeight: "bold",
        fontSize: 32,
        textAlign: "center",
        letterSpacing: 8,
        marginVertical: 3,
      }}
      ref={tokenRef}
    />
  );

  const secureChange = (
    <View>
      <InputField
        name={tokenType}
        placeholder={`Enter new ${tokenType}`}
        error={errorMessage}
        onChangeText={(text) => {
          setField(text);
        }}
        ref={passwordRef}
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
