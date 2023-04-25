import React from "react";
import { InputField } from "../../Components/InputField";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import styles, { height, width } from "../../styles";
import { AnimatedButton } from "../../Components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faFish } from "@fortawesome/free-solid-svg-icons";
import ImageView from "../../Components/ImageView";

import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
} from "react-native-reanimated";

const DELAY_AMOUNT = 250;

const CatchDetail = ({ route, navigation }) => {
  const { catch: result } = route.params;
  const [selected, setSelected] = React.useState(true);
  const [screenState, setScreenState] = React.useState(0);
  const [imageView, setImageView] = React.useState();

  const notesRef = React.createRef();

  const animateDetails = useAnimatedStyle(() => {
    const interpolation = interpolate(screenState, [0, 1], [0, -100]);

    return {
      transform: [{ translateY: withTiming(interpolation, { duration: 250 }) }],
    };
  });

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
      placeholder: label,
      name: label.toLowerCase(),
      ref,
    };
  };

  const AdditionalDetails = (
    <View style={{ marginVertical: !!!result.errors ? 50 : 0 }}>
      {result.weight && (
        <Text
          style={[myStyles.detailText, { textAlign: "left", marginBottom: 10 }]}
        >
          Weight: {result.weight} (lbs)
        </Text>
      )}
      {result.bait && (
        <Text
          style={[myStyles.detailText, { textAlign: "left", marginBottom: 10 }]}
        >
          Bait used: {result.bait}
        </Text>
      )}
      {result.note && (
        <InputField
          {...inputProps("Notes", undefined, undefined)}
          {...{
            multiline: true,
            height: 200,
            maxLength: 500,
            value: result.note,
            editable: false,
          }}
          pretext={"Notes"}
        />
      )}
    </View>
  );

  const AllDetails = (
    <>
      <View
        style={{
          borderBottomWidth: 1,
        }}
      >
        <Text style={myStyles.header}>{`You caught a ${result.species}!`}</Text>
      </View>

      <View
        style={{
          marginHorizontal: 20,
          marginVertical: 25,
        }}
      >
        {AdditionalDetails}
        <View style={{ flexDirection: "row" }}>
          <Text style={[myStyles.detailText, { textAlign: "left" }]}>
            Time: {new Date(result.date).toLocaleTimeString()}
          </Text>

          <Text style={[myStyles.detailText, { textAlign: "right" }]}>
            Date: {new Date(result.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </>
  );

  const DetailsView = (
    <Animated.View style={[myStyles.split, animateDetails]}>
      {AllDetails}
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
        {
          // <AnimatedButton
          //   style={myStyles.button}
          //   next={() => {
          //     navigation.navigate("CreatePost", result);
          //   }}
          // >
          //
          //   <View style={{ justifyContent: "center", alignItems: "center" }}>
          //     <FontAwesomeIcon icon={faFish} size={25} />
          //     <Text style={{ fontSize: 20, flex: 1 }}>{"Post Catch"}</Text>
          //   </View>
          // </AnimatedButton>
        }

        <AnimatedButton
          style={{ ...myStyles.button }}
          next={() => {
            navigation.navigate("CatchLogger");
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <FontAwesomeIcon icon={faArrowLeft} size={25} />
            <Text
              style={{
                fontSize: 20,
                flex: 1,
              }}
            >
              {"Back"}
            </Text>
          </View>
        </AnimatedButton>
      </View>
    </View>
  );

  const fetchImage = async () => {
    let tempString = result.imageUri;
    let finalString = tempString.replace(
      "fishquest/development",
      "development/catches"
    );
    const valid = await fetch(finalString)
      .then((res) => {
        return res.status !== 403;
      })
      .catch((error) => {
        console.error(error);
      });

    setImageView(
      <ImageView
        delayAnimationAmount={DELAY_AMOUNT}
        setter={(select) => setSelected(select)}
        image={valid ? { uri: finalString } : undefined}
      />
    );
  };

  React.useEffect(() => {
    fetchImage();
  }, []);

  const FullView = (
    <View style={myStyles.parentContainer}>
      {!imageView ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <ActivityIndicator
            size="large"
            style={{ flex: 1, justifyContent: "center" }}
          />
        </View>
      ) : (
        <>
          <ScrollView>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                margin: 30,
                marginVertical: selected ? 50 : 0,
              }}
            >
              {imageView}
            </View>
            {DetailsView}
          </ScrollView>
          {ChoiceButtons}
        </>
      )}
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

export default CatchDetail;
