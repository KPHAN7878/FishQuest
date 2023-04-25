import React from "react";
import { Client } from "../../utils/connection";
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
} from "react-native-reanimated";
import Missions from "../Missions/Missions";

const DELAY_AMOUNT = 250;

const Result = ({ route, navigation }) => {
  const result = route.params;
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [timeDate, setTimeDate] = React.useState(new Date());
  const [selected, setSelected] = React.useState(true);
  const [screenState, setScreenState] = React.useState(0);

  const fishNameRef = React.createRef();
  const [fishName, setFishName] = React.useState("");

  const weightRef = React.createRef();
  const [weight, setWeight] = React.useState();

  const baitRef = React.createRef();
  const [bait, setBait] = React.useState();

  const notesRef = React.createRef();
  const [notes, setNotes] = React.useState();

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

  const addInfo = async () => {
    const info = {
      species: fishName === "" ? result.species : fishName,
      id: result.catchId,
      weight,
      bait,
      note: notes,
    };

    const res = await Client.post("catch/add-info", info);
    if (res?.data.errors) {
      const errors = toErrorMap(res.data.errors);
      setErrorMessage(errors);
      return;
    } else {
      setErrorMessage(null);
    }
  };

  const inputProps = (label, setter, ref) => {
    return {
      onFocus: () => {
        setScreenState(2);
      },
      onSubmitEditing: () => {
        setScreenState(0);
        Keyboard.dismiss();
      },
      onChangeText: (text) => setter(text),
      error: errorMessage,
      placeholder: label,
      name: label.toLowerCase(),
      ref,
    };
  };

  const InputFish = (
    <InputField
      {...{
        onChangeText: (text) => setFishName(text),
        onFocus: () => {
          setScreenState(1);
        },
        onSubmitEditing: () => {
          setScreenState(0);
          Keyboard.dismiss();
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

  const AdditionalDetails = (
    <View style={{ marginTop: !!!result.errors ? 50 : 0 }}>
      <InputField
        {...inputProps("Weight (lbs)", setWeight, weightRef)}
        {...{ keyboardType: "numeric" }}
        pretext={"Weight of the fish (optional)"}
      />
      <InputField
        {...inputProps("Bait", setBait, baitRef)}
        pretext={"Bait used (optional)"}
      />
      <InputField
        {...inputProps("Notes", setNotes, notesRef)}
        {...{
          multiline: true,
          height: 200,
          maxLength: 500,
        }}
        pretext={"Additional notes (optional)"}
      />
    </View>
  );

  const ProgressView = (
    <>
      <View
        style={{
          borderBottomWidth: 1,
          marginVertical: 25,
        }}
      >
        <Text style={myStyles.header}>Progress</Text>
      </View>
      <Missions navigation={navigation} />
    </>
  );

  const AllDetails = (
    <>
      {!result.species ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
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

      {AdditionalDetails}
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
      </View>
    </>
  );

  const DetailsView = (
    <Animated.View style={[myStyles.split, animateDetails]}>
      {AllDetails}
      {ProgressView}
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
            addInfo();

            if (!!!errorMessage || fishName) navigation.navigate("CatchLogger");
            else fishNameRef.current.focus();
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
