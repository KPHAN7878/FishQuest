import React from "react";

import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
} from "react-native-reanimated";
import { InputField } from "../../Components/InputField";
import ImageView from "../../Components/ImageView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFish,
  faArrowLeft,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatedButton } from "../../Components/Button";
import {
  Keyboard,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import styles, { height, width } from "../../styles";
import { Client } from "../../utils/connection";

const CreatePost = ({ route, navigation }) => {
  const [text, setCaption] = React.useState("");
  const [selected, setSelected] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [screenState, setScreenState] = React.useState(0);
  const captionRef = React.createRef();
  const [opacity, setOpacity] = React.useState(0);

  const result = route.params;

  React.useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        setScreenState(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const submitPost = async (catchID) => {
    console.log("catchId: " + catchID + "\n\ntext: " + text);
    await Client.post("post/create", {
      catchId: catchID,
      text: text,
    })
      .then((res) => {
        console.log("\n\nsubmit post response: " + res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const animateDetails = useAnimatedStyle(() => {
    const interpolation = interpolate(
      selected ? screenState : 2,
      [0, 1, 2],
      [0, -350, 350]
    );

    return {
      transform: [{ translateY: withTiming(interpolation, { duration: 250 }) }],
    };
  });

  const dropPrompt = useAnimatedStyle(() => {
    const interpolation = interpolate(screenState, [0, 1], [0.0, 1.0]);
    return {
      opacity: withTiming(interpolation, { duration: 250 }),
    };
  });

  const ChoiceButtons = (
    <View style={myStyles.container}>
      <View
        style={[
          styles.buttonContainer,
          {
            backgroundColor: "white",
            paddingBottom: 15,
            maxHeight: height * 0.1,
          },
        ]}
      >
        <AnimatedButton
          style={myStyles.button}
          next={() => {
            navigation.goBack();
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <FontAwesomeIcon icon={faArrowLeft} size={25} />
            <Text style={{ fontSize: 20, flex: 1 }}>{"Cancel"}</Text>
          </View>
        </AnimatedButton>

        <AnimatedButton
          style={{ ...myStyles.button }}
          next={() => {
            submitPost(result.catchId);
            navigation.navigate("CatchLogger");
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <FontAwesomeIcon icon={faFish} size={25} />
            <Text
              style={{
                fontSize: 20,
                flex: 1,
              }}
            >
              {"Post"}
            </Text>
          </View>
        </AnimatedButton>
      </View>
    </View>
  );

  const SplitView = (
    <Animated.View style={[myStyles.split, animateDetails]}>
      <TouchableOpacity
        style={{ border: 3 }}
        onPress={() => {
          Keyboard.dismiss();
          setOpacity(opacity === 0 ? 1 : 0);
        }}
      >
        <Animated.View style={[styles.closeButtonContainer, dropPrompt]}>
          <FontAwesomeIcon icon={faChevronDown} size={25} />
        </Animated.View>
      </TouchableOpacity>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <InputField
          {...{
            onChangeText: (caption) => setCaption(caption),

            onFocus: () => {
              setScreenState(1);
            },
            error: errorMessage,
            placeholder: "Type here",
            placeholderTextColor: "gray",
            name: "caption",
            ref: captionRef,
            multiline: true,
            height: 200,
            maxLength: 500,
          }}
          styleView={{ flex: 1 }}
          pretext={"Post Caption"}
        />
      </View>
      {ChoiceButtons}
      <View style={{ backgroundColor: "white", height: "100%" }}></View>
    </Animated.View>
  );

  return (
    <>
      <View style={myStyles.parentContainer}>
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginVertical: selected ? 50 : 0,
            }}
          >
            <ImageView
              setter={(select) => setSelected(select)}
              image={result.image}
            />
          </View>
        </ScrollView>
      </View>
      {selected ? SplitView : <></>}
    </>
  );
};

const myStyles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
  },

  container: {
    height: "100%",
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: "white",
    flex: 1,
    position: "relative",
    bottom: 0,
    width,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  split: {
    backgroundColor: "white",
    shadowColor: "gray",
    shadowOpacity: 0.2,
    position: "absolute",
    bottom: 0,
    shadowRadius: 3,
  },

  resultText: {
    flex: 1,
    fontSize: 20,
  },
  parentContainer: {
    display: "flex",
    justifyContent: "flex-start",
  },
  detailText: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
  },
});

export default CreatePost;
