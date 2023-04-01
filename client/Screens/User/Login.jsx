import React, { useState, createRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
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
import { UserContext } from "../../Contexts/UserContext";

import { StackActions, NavigationActions } from "@react-navigation/native";

import * as Location from "expo-location";

const Login = ({ navigation }) => {
  const [screenState, setScreenState] = useState(1);

  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPwd, setisForgotPwd] = useState(false);
  const [isForgotUsr, setisForgotUsr] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [sentEmail, setSentEmail] = useState(false);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const usernameRef = createRef();
  const passwordRef = createRef();
  const emailRef = createRef();

  const formButtonScale = useSharedValue(1);
  const fUserScale = useSharedValue(1);
  const fPassScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  const { user, setUser } = useContext(UserContext);

  //location services
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  React.useEffect(() => {
    if (usernameRef && isForgotPwd) {
      usernameRef.current.focus();
    }
    if (emailRef && isForgotUsr) {
      emailRef.current.focus();
    }
  }, [isForgotUsr, isForgotPwd]);

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

  const fUserScaleAnimated = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fUserScale.value }],
    };
  });

  const fPassScaleAnimated = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fPassScale.value }],
    };
  });

  const flushInputs = () => {
    setEmail("");
    setUsername("");
    setPassword("");

    setisForgotPwd(false);
    setisForgotUsr(false);
    setSentEmail(false);

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
      .then((res) => {
        Keyboard.dismiss();
        setScreenState(1);
        setErrorMessage(null);
        navigation.navigate("Home"); //navigation.navigate("Profile");

        buttonOpacity.value = 1;

        //let test = JSON.stringify(res.data)
        let currentUser = res.data;
        setUser(currentUser);
        console.log("FINAL STRING: " + currentUser);
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
    const res = await Client.post("user/forgot-password", { username }).catch(
      (err) => {
        console.log(err);
      }
    );
    console.log(res.data.errors);

    if (res?.data.errors) {
      const errors = toErrorMap(res.data.errors);
      setErrorMessage(errors);
      return;
    } else {
      setErrorMessage(null);
    }

    navigation.navigate("SecureToken", {
      pretext:
        `If the username provided matches an existing account` +
        ` you will receive an email with a password reset code`,
      endpoint: "change-password",
      tokenType: "password",
      goBack: "Login",
      username,
    });
    setScreenState(0);
    setisForgotPwd(false);
  };

  const initialScreen = (
    <View
      style={{
        marginBottom: height * 0.05,
        // display: screenState === 1 ? "block" : "none",
        display:
          screenState === 1
            ? Platform.os === "ios"
              ? "block"
              : "flex"
            : "none",
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

  const sendUsernames = async () => {
    const res = await Client.post("user/forgot-username", { email });
    if (res?.data.errors) {
      const errors = toErrorMap(res.data.errors);
      setErrorMessage(errors);
      setSentEmail(false);
      return;
    } else {
      setErrorMessage(null);
    }

    setSentEmail(true);
    setScreenState(0);
    Keyboard.dismiss();
  };

  const forgot = (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: isForgotPwd || isForgotUsr ? "" : "center",
        }}
      >
        <Animated.View style={fPassScaleAnimated}>
          {!isForgotUsr && (
            <Pressable
              onPress={() => {
                fPassScale.value = withSequence(withSpring(1.5), withSpring(1));
                setisForgotPwd(!isForgotPwd);
                setErrorMessage(
                  errorMessage
                    ? { password: "Your username or password may be incorrect" }
                    : null
                );
              }}
            >
              <Text style={styles.interactiveText}>
                {isForgotPwd ? "Back" : "Forgot password"}
              </Text>
            </Pressable>
          )}
        </Animated.View>
        <Animated.View style={fUserScaleAnimated}>
          {!isForgotPwd && (
            <Pressable
              onPress={() => {
                fUserScale.value = withSequence(withSpring(1.5), withSpring(1));
                if (isForgotUsr) {
                  setScreenState(0);
                }
                setSentEmail(false);
                setisForgotUsr(!isForgotUsr);
              }}
            >
              <Text style={styles.interactiveText}>
                {isForgotUsr ? "Back" : "Forgot username"}
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </View>

      {(isForgotPwd || isForgotUsr) && (
        <Animated.View style={[formButtonAnimatedStyle]}>
          <Pressable
            style={styles.formButton}
            onPress={() => {
              formButtonScale.value = withSequence(
                withSpring(1.5),
                withSpring(1)
              );
              isForgotPwd ? createPasswordToken() : sendUsernames();
            }}
          >
            <Text style={styles.buttonText}>
              {isForgotPwd ? "Next" : sentEmail ? "Resubmit" : "Submit"}
            </Text>
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

  const usernameField = (
    <InputField
      {...inputProps("Username", setUsername, usernameRef)}
      onSubmitEditing={
        isForgotPwd
          ? () => createPasswordToken()
          : () => passwordRef.current.focus()
      }
      pretext={
        isForgotPwd ? "Enter the username you use to sign in with" : undefined
      }
    />
  );

  const passwordField = (
    <InputField
      {...inputProps("Password", setPassword, passwordRef)}
      secureTextEntry={true}
      style={{
        ...styles.textInput,
        marginVertical: 3,
      }}
      onSubmitEditing={() => {
        registerOrLogin(isRegistering);
      }}
    />
  );

  const emailField = (
    <View>
      <InputField
        {...inputProps("Email", setEmail, emailRef)}
        pretext={
          sentEmail || isRegistering
            ? undefined
            : `If the email provided matches with an existing account` +
              ` you will receive an email with a password reset code`
        }
        footer={sentEmail ? "Email Sent" : undefined}
        onSubmitEditing={
          isForgotUsr
            ? () => sendUsernames()
            : () => usernameRef.current.focus()
        }
      />
    </View>
  );

  const submitForm = (
    <Animated.View style={[formButtonAnimatedStyle]}>
      <Pressable
        style={styles.formButton}
        onPress={() => {
          formButtonScale.value = withSequence(withSpring(1.5), withSpring(1));
          registerOrLogin(isRegistering);
        }}
      >
        <Text style={styles.buttonText}>
          {isRegistering ? "REGISTER" : "LOG IN"}
        </Text>
      </Pressable>
    </Animated.View>
  );

  const formScreen = (
    <Animated.View
      style={[
        {
          marginBottom: height * 0.05,
          // display: screenState === 1 ? "none" : "block",
          display:
            screenState === 1
              ? "none"
              : Platform.os === "ios"
              ? "block"
              : "flex",
          visibility: screenState === 1 ? "visible" : "hidden",
        },
        formAnimatedStyle,
      ]}
    >
      {(isRegistering || isForgotUsr) && emailField}
      {!isForgotUsr && usernameField}
      {!(isForgotPwd || isForgotUsr) && passwordField}

      {!isRegistering && forgot}
      {!(isForgotPwd || isForgotUsr) && submitForm}
    </Animated.View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setScreenState(screenState === 1 ? 1 : 0);
        Keyboard.dismiss();
      }}
      accessible={false}
    >
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
        <View>
          {initialScreen}
          {formScreen}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
