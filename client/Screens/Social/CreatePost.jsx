import React from "react";

import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { InputField } from "../../Components/InputField";
import ImageView from "../../Components/ImageView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFish, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AnimatedButton } from "../../Components/Button";
import { Keyboard, Text, View, ScrollView, StyleSheet } from "react-native";
import styles, { height, width } from "../../styles";
import { Client } from "../../utils/connection";

const CreatePost = ({ route, navigation }) => {
  const [text, setCaption] = React.useState("");
  const [selected, setSelected] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [screenState, setScreenState] = React.useState(0);
  const captionRef = React.createRef();

  const result = route.params;
  console.log(result.catchId);

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
    const interpolation = interpolate(screenState, [0, 1], [-125, -350]);

    return {
      transform: [{ translateY: withTiming(interpolation, { duration: 250 }) }],
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
            <Text style={{ fontSize: 20, flex: 1 }}>{"Back"}</Text>
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

  return (
    <View style={myStyles.parentContainer}>
      <ScrollView>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            margin: 30,
            marginTop: selected ? 50 : 0,
          }}
        >
          <ImageView
            setter={(select) => setSelected(select)}
            image={result.image}
          />
        </View>

        <Animated.View style={[myStyles.split, animateDetails]}>
          <View
            style={{
              marginTop: 0.025 * height,
              display: "flex",
              flexDirection: "row",
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
                height: 300,
              }}
              styleView={{ flex: 1 }}
              pretext={"Post Caption"}
            />
          </View>
        </Animated.View>
      </ScrollView>

      {ChoiceButtons}
    </View>
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
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flex: 1,
    position: "absolute",
    width,
    height: height * 0.1,
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  split: {
    backgroundColor: "white",
    height: "100%",
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
  },

  resultText: {
    flex: 1,
    fontSize: 20,
  },
  parentContainer: {
    flex: 1,
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
