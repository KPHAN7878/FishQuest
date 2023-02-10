import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import styles from "../../styles";
import Svg, { Image, Ellipse, ClipPath } from "react-native-svg";
import { FishQuestClient } from "../../utils/connection";
import { InputField } from "../Components/InputField";

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

const Login = () => {
  const { height, width } = Dimensions.get("window");
  const [screenState, setScreenState] = useState(1);
  const formButtonScale = useSharedValue(1);
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(
      screenState,
      [0, 1, 2],
      [-height * 0.6, 0, -height * 1.0]
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
      opacity: withTiming(screenState, { duration: 500 }),
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const closeButtonContainerStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(screenState, [0, 1], [180, 360]);
    return {
      opacity: withTiming(screenState === 1 ? 0 : 1, { duration: 800 }),
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
        screenState !== 1
          ? withDelay(400, withTiming(1, { duration: 800 }))
          : withTiming(0, { duration: 300 }),
    };
  });

  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });

  const loginHandler = () => {
    setScreenState(0);
    if (isRegistering) {
      setIsRegistering(false);
    }
  };

  const registerHandler = () => {
    setScreenState(0);
    if (!isRegistering) {
      setIsRegistering(true);
    }
  };

  const registerOrLogin = async (isRegistering) => {
    let newUser = {
      username: username,
      email: email,
      password: password,
    };

    const endpoint = isRegistering ? "register" : "login";
    FishQuestClient.post(`user/${endpoint}`, newUser)
      .then((res) => {
        if (res?.data.errors) {
          const errors = toErrorMap(res.data.errors);
          setErrorMessage(errors);
        } else {
          setScreenState(0);
          Keyboard.dismiss();
          setErrorMessage(null);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const badCredentials = {};
          badCredentials["password"] =
            "Your username or password may be incorrect";
          setErrorMessage(badCredentials);
        }
      });
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
          name="email"
          label="Email"
          setValue={(text) => setEmail(text)}
          setScreenState={(val) => {
            setScreenState(val);
          }}
          error={errorMessage}
        />
      )}
      <InputField
        name="username"
        label="Username"
        setValue={(text) => setUsername(text)}
        setScreenState={(val) => {
          setScreenState(val);
        }}
        error={errorMessage}
      />
      <InputField
        name="password"
        label="Password"
        secureTextEntry={true}
        setValue={(text) => setPassword(text)}
        setScreenState={(val) => {
          setScreenState(val);
        }}
        error={errorMessage}
      />

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
