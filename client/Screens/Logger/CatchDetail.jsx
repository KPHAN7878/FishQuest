import React from "react";
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
import { faArrowRight, faFish } from "@fortawesome/free-solid-svg-icons";
import ImageView from "../../Components/ImageView";

import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import Missions from "../Missions/Missions";

const DELAY_AMOUNT = 250;

const CatchDetail = ({ route, navigation }) => {
  const { catch: result } = route.params;
  const [selected, setSelected] = React.useState(true);
  const [screenState, setScreenState] = React.useState(0);
  const [imageView, setImageView] = React.useState();

  const animateDetails = useAnimatedStyle(() => {
    const interpolation = interpolate(screenState, [0, 1], [0, -100]);

    return {
      transform: [{ translateY: withTiming(interpolation, { duration: 250 }) }],
    };
  });

  const AdditionalDetails = (
    <View style={{ marginTop: !!!result.errors ? 50 : 0 }}>
      {result.weight && <Text>Weight: {result.weight} (lbs)</Text>}
      {result.bait && <Text>Bait used: {result.bait}</Text>}
      {result.note && <Text>Notes: {result.note}</Text>}
    </View>
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
