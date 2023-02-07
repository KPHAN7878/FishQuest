//import React from 'react'

import { StatusBar } from "expo-status-bar";
import React, { useState } from "react"
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  TextInput, 
  Pressable,
} from "react-native";

import styles from "../../styles";
import Svg, { Image, Ellipse, ClipPath } from "react-native-svg";
import axios from "axios";

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  withTiming, 
  withDelay, 
  withSequence, 
  withSpring
} from "react-native-reanimated";

const Login = (props) => {
    const { height, width } = Dimensions.get("window");
    const imagePosition = useSharedValue(1);
    const  formButtonScale = useSharedValue(1);
    const [isRegistering, setIsRegistering] = useState(false);



    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
  
    const imageAnimatedStyle = useAnimatedStyle(() => {
      const interpolation = interpolate(
        imagePosition.value,
         [0, 1], 
         [-height / 1.55, 0]
         );
      return {
        transform: [
          { translateY: withTiming(interpolation, { duration: 1000 }) },
        ],
      };
    });
  
    const buttonsAnimatedStyle = useAnimatedStyle (() => {
      const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0])
      return {
        opacity: withTiming(imagePosition.value, { duration: 500 }),
        transform: [
          {translateY: withTiming(interpolation, { duration: 1000 }) },
        ],
      };
    });
  
    const closeButtonContainerStyle = useAnimatedStyle(() => {
      const interpolation = interpolate(imagePosition.value, [0, 1], [180, 360])
      return {
        opacity: withTiming(imagePosition.value === 1 ? 0 : 1, { duration: 800 }), 
        transform: [
          { rotate: withTiming(interpolation + "deg", { duration: 1000 }) },
        ],
      };
    });
  
    const formAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: 
          imagePosition.value === 0 
            ? withDelay(400, withTiming(1, { duration: 800 }))
            : withTiming(0, {duration: 300}),
      };
    });
  
    const loginHandler = () => {
      imagePosition.value = 0;
      if(isRegistering){
        setIsRegistering(false);
      }
    };
  
    const formButtonAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{scale: formButtonScale.value}]
      };
    });
  
    const registerHandler = () => {
      imagePosition.value = 0;
      if(!isRegistering){
        setIsRegistering(true);
      }
    };

    const registerOrLogin = async (isRegistering) => {
        if (isRegistering) {

            let newUser = {
                username: username,
                email: email,
                password: password
            }

            await axios
            .post("http://YOUR IP ADDRESS:3000/user/register", newUser)
            .then((res) => {
                console.log(res)
                // if (res.status == 200) {
                //     Toast.show({
                //         topOffset: 60,
                //         type: "success",
                //         text1: "Registration Succeeded",
                //         text2: "Please Login into your account",
                //     })
                //     setTimeout(() => {
                //         props.navigation.navigate("Login");
                //     }, 500)
                // }

                if (res.status == 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Registration Succeeded",
                        text2: "Please Login into your account",
                    })
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again",
                })
            })
        }
    }
  
    return (
      <Animated.View style={styles.container}>
        <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
          <Svg height={height + 100} width={width}>
            <ClipPath id="clipPathId">
              <Ellipse cx={width / 2} rx={height} ry={height + 100}/>
            </ClipPath>
            <Image 
              href={require('../../assets/Fish.jpg')} 
              width={width + 100}
              height={height + 100}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#clipPathId)"
            />
          </Svg>
          <Animated.View style={[styles.closeButtonContainer, closeButtonContainerStyle]}>
            <Text onPress={() => imagePosition.value = 1}>X</Text>
          </Animated.View>
        </Animated.View>
  
        <View style={styles.bottomContainer}>
          <Animated.View style={buttonsAnimatedStyle}>
            <Pressable style={styles.button} onPress={loginHandler}>
              <Text style={styles.buttonText}>LOG IN</Text>
            </Pressable>
          </Animated.View>
          <Animated.View style={buttonsAnimatedStyle}>
            <Pressable style={styles.button}onPress={registerHandler}>
              <Text style={styles.buttonText}>REGISTER</Text>
            </Pressable>
          </Animated.View>
  
          <Animated.View style = {[styles.formInputContainer, formAnimatedStyle]}>
            {isRegistering && (
              <TextInput 
                placeholder="Email" 
                placeholderTextColor="black" 
                style={styles.textInput}
                onChangeText={(text) => setEmail(text)}
              />
            )}
            <TextInput 
              placeholder="Username" 
              placeholderTextColor="black" 
              style={styles.textInput}
              onChangeText={(text) => setUsername(text)}
            />
            <TextInput 
              placeholder="Password" 
              placeholderTextColor="black" 
              style={styles.textInput}
              onChangeText={(text) => setPassword(text)}
            />
            <Animated.View style={[styles.formButton, formButtonAnimatedStyle]}>
                <Pressable onPress={ () => {formButtonScale.value = withSequence(withSpring(1.5), withSpring(1)); registerOrLogin(isRegistering)} }>
                  <Text style={styles.buttonText}>
                    {isRegistering ? 'REGISTER' : 'LOG IN'}
                  </Text>
                </Pressable>
            </Animated.View>
          </Animated.View> 
        </View>
      </Animated.View>
    );
}

export default Login