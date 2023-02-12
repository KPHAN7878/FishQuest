import React, { useState, createRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import styles, { width, height } from "../../styles";
import Svg, { Image, Ellipse, ClipPath } from "react-native-svg";
import { Client } from "../../utils/connection";
import { InputField } from "../../Components/InputField";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { toErrorMap } from "../../utils/toErrorMap";

const Login = ({ navigation }) => {
  const [screenState, setScreenState] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPwd, setisForgotPwd] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const usernameRef = createRef();
  const passwordRef = createRef();
  const emailRef = createRef();

  const formButtonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(
      screenState,
      [0, 1, 2],
      [-height * 0.65, 0, -height * 1.0]
    );
    return {
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(screenState, [0, 1, 2], [250, 0, 250]);
    return {
      opacity: withTiming(buttonOpacity.value, { duration: 500 }),
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const closeButtonContainerStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(screenState, [0, 1], [180, 360]);
    return {
      opacity: withTiming(buttonOpacity.value === 1 ? 0 : 1, { duration: 800 }),
      transform: [
        { rotate: withTiming(interpolation + "deg", { duration: 1000 }) },
      ],
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(screenState, [0, 2], [0, -height * 0.35]);
    return {
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
      opacity:
        buttonOpacity.value === 0
          ? withDelay(400, withTiming(1, { duration: 800 }))
          : withTiming(0, { duration: 300 }),
    };
  });

  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });

  const flushInputs = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setisForgotPwd(false);

    usernameRef.current?.setNativeProps({ text: "" });
    passwordRef.current?.setNativeProps({ text: "" });
    emailRef.current?.setNativeProps({ text: "" });

    buttonOpacity.value = 0;
    setScreenState(0);
  };

  const loginHandler = () => {
    flushInputs();

    if (isRegistering) {
      setIsRegistering(false);
    }
  };

  const registerHandler = () => {
    flushInputs();

    if (!isRegistering) {
      setIsRegistering(true);
    }
  };

  const registerOrLogin = async (isRegistering) => {
    const badCredentials = {};
    let user = {
      username: username,
      email: email,
      password: password,
    };

    if (isRegistering) {
      const res = await Client.post("user/register", user);
      if (res?.data.errors) {
        const errors = toErrorMap(res.data.errors);
        setErrorMessage(errors);
        return;
      } else {
        setErrorMessage(null);
      }
    }

    await Client.post("user/login", user)
      .then(() => {
        Keyboard.dismiss();
        setScreenState(1);
        setErrorMessage(null);
        navigation.navigate("Profile");
        buttonOpacity.value = 1;
      })
      .catch((err) => {
        if (err.response.status === 401) {
          badCredentials["password"] =
            "Your username or password may be incorrect";
          setErrorMessage(badCredentials);
        }
      });
  };

  const createPasswordToken = async () => {
    Client.post("user/forgot-password", { username }).catch((err) => {
      console.log(err);
    });

    navigation.navigate("SecureToken", {
      pretext:
        `If the username provided matches an existing account,` +
        ` you will receive an email with a password reset code`,
      endpoint: "change-password",
      tokenType: "password",
      goBack: "Login",
      username,
    });
    setisForgotPwd(false);
  };

  const initialScreen = (
    <View
      style={{
        marginBottom: height * 0.05,
        display: screenState === 1 ? "block" : "none",
        visibility: screenState === 1 ? "hidden" : "visible",
      }}
    >
      <View>
        <Animated.View style={buttonsAnimatedStyle}>
          <Pressable style={styles.button} onPress={loginHandler}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={buttonsAnimatedStyle}>
          <Pressable style={styles.button} onPress={registerHandler}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );

  const forgotPassword = (
    <View>
      <Pressable
        onPress={() => {
          setisForgotPwd(!isForgotPwd);
        }}
      >
        <Text style={styles.interactiveText}>
          {isForgotPwd ? "Cancel" : "Forgot password"}
        </Text>
      </Pressable>

      {isForgotPwd && (
        <Animated.View style={[formButtonAnimatedStyle]}>
          <Pressable
            style={styles.formButton}
            onPress={() => {
              formButtonScale.value = withSequence(
                withSpring(1.5),
                withSpring(1)
              );
              createPasswordToken();
            }}
          >
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );

  const inputProps = (label, setter, ref) => {
    return {
      onFocus: () => {
        setScreenState(2);
      },
      onSubmitEditing: () => {
        setScreenState(0);
      },
      onChangeText: (text) => setter(text),
      error: errorMessage,
      placeholder: label,
      name: label.toLowerCase(),
      ref,
    };
  };

  const formScreen = (
    <Animated.View
      style={[
        {
          marginBottom: height * 0.05,
          display: screenState === 1 ? "none" : "block",
          visibility: screenState === 1 ? "visible" : "hidden",
        },
        formAnimatedStyle,
      ]}
    >
      {isRegistering && (
        <InputField
          {...inputProps("Email", setEmail, emailRef)}
          onSubmitEditing={() => usernameRef.current.focus()}
        />
      )}
      <InputField
        {...inputProps("Username", setUsername, usernameRef)}
        onSubmitEditing={() => passwordRef.current.focus()}
        pretext={
          isForgotPwd ? "Enter the username you use to sign in with" : undefined
        }
      />
      <InputField
        {...inputProps("Password", setPassword, passwordRef)}
        secureTextEntry={true}
        editable={!isForgotPwd}
        style={{
          ...styles.textInput,
          opacity: isForgotPwd ? 0 : 1,
          marginVertial: 3,
        }}
      />

      {!isRegistering && forgotPassword}
      {!isForgotPwd && (
        <Animated.View style={[formButtonAnimatedStyle]}>
          <Pressable
            style={styles.formButton}
            onPress={() => {
              formButtonScale.value = withSequence(
                withSpring(1.5),
                withSpring(1)
              );
              registerOrLogin(isRegistering);
            }}
          >
            <Text style={styles.buttonText}>
              {isRegistering ? "REGISTER" : "LOG IN"}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
        <Svg height={height + 100} width={width}>
          <ClipPath id="clipPathId">
            <Ellipse cx={width / 2} rx={height} ry={height + 100} />
          </ClipPath>
          <Image
            href={require("../../assets/Fish.jpg")}
            width={width + 100}
            height={height + 100}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clipPathId)"
          />
        </Svg>
        <TouchableOpacity
          style={[styles.closeButtonContainer]}
          onPress={() => {
            Keyboard.dismiss();
            setScreenState(1);
            setErrorMessage(null);
            buttonOpacity.value = 1;
          }}
        >
          <Animated.View style={[closeButtonContainerStyle]}>
            <Text>X</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
      {initialScreen}
      {formScreen}
    </Animated.View>
  );
};

export default Login;
