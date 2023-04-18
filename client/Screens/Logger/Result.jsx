import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";
import styles, { height, width } from "../../styles";
import { toErrorMap } from "../../utils/toErrorMap";
import { AnimatedButton } from "../../Components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRight, faFish } from "@fortawesome/free-solid-svg-icons";
import { InputField } from "../../Components/InputField";
import ImageView from "../../Components/ImageView";

import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import Missions from "../Missions/Missions";

const DELAY_AMOUNT = 250;

const Result = ({ route, navigation }) => {
  const result = route.params;
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [timeDate, setTimeDate] = React.useState(new Date());
  const [fishName, setFishName] = React.useState("");
  const [selected, setSelected] = React.useState(true);
  const [screenState, setScreenState] = React.useState(0);
  const fishNameRef = React.createRef();

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

  React.useEffect(() => {
    if (result.errors) {
      const errors = toErrorMap(result.errors);
      setErrorMessage(errors);
    }
  }, [setErrorMessage]);

  const animateDetails = useAnimatedStyle(() => {
    const interpolation = interpolate(screenState, [0, 1], [0, -100]);

    return {
      transform: [{ translateY: withTiming(interpolation, { duration: 250 }) }],
    };
  });

  const InputFish = (
    <InputField
      {...{
        onChangeText: (text) => setFishName(text),
        onFocus: () => {
          setScreenState(1);
        },
        error: errorMessage,
        placeholder: "Fish name",
        name: "species",
        ref: fishNameRef,
      }}
      styleView={{ flex: 1 }}
      pretext={"Enter the name of the fish"}
    />
  );

  const Progress = (
    <View
      style={{
        borderBottomWidth: 1,
        marginVertical: 25,
      }}
    >
      <Text style={myStyles.header}>Progress</Text>
    </View>
  );

  const DetailsView = (
    <Animated.View style={[myStyles.split, animateDetails]}>
      {!result.species ? (
        <View
          stle={{
            display: "flex",
            flexDirection: "row",
            borderBottomWidth: 1,
          }}
        >
          {InputFish}
        </View>
      ) : (
        <View
          style={{
            borderBottomWidth: 1,
          }}
        >
          <Text style={myStyles.header}>
            {`You caught a ${result.species}!`}
          </Text>
        </View>
      )}
      <View
        style={{
          marginHorizontal: 20,
          marginTop: 25,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[myStyles.detailText, { textAlign: "left" }]}>
            Time: {timeDate.toLocaleTimeString()}
          </Text>

          <Text style={[myStyles.detailText, { textAlign: "right" }]}>
            Date: {timeDate.toLocaleDateString()}
          </Text>
        </View>

        {
          //<View style={{ marginTop: 50, flexDirection: "row" }}>
          //    <Text style={[myStyles.detailText, { textAlign: "left" }]}>
          //      Location: {result.location}
          //   </Text>
          // </View>
        }
      </View>
      {Progress}
      <Missions navigation={navigation} />
    </Animated.View>
  );

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
            navigation.navigate("CreatePost", result);
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <FontAwesomeIcon icon={faFish} size={25} />
            <Text style={{ fontSize: 20, flex: 1 }}>{"Post Catch"}</Text>
          </View>
        </AnimatedButton>

        <AnimatedButton
          style={{ ...myStyles.button }}
          next={() => {
            navigation.navigate("CatchLogger");
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <FontAwesomeIcon icon={faArrowRight} size={25} />
            <Text
              style={{
                fontSize: 20,
                flex: 1,
              }}
            >
              {"Continue"}
            </Text>
          </View>
        </AnimatedButton>
      </View>
    </View>
  );

  const FullView = (
    <View style={myStyles.parentContainer}>
      <ScrollView>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            margin: 30,
            marginVertical: selected ? 50 : 0,
          }}
        >
          <ImageView
            delayAnimationAmount={DELAY_AMOUNT}
            setter={(select) => setSelected(select)}
            image={result.image}
          />
        </View>
        {DetailsView}
      </ScrollView>
      {ChoiceButtons}
    </View>
  );

  return FullView;
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
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    padding: 20,
    height: "100%",

    marginBottom: height * 0.1,
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
  header: {
    fontWeight: "bold",
    fontSize: 24,
    width: "100%",
    textAlign: "center",
  },
});

export default Result;
