import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import styles, { height, width } from "../../styles";
import { toErrorMap } from "../../utils/toErrorMap";
import { AnimatedButton } from "../../Components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRight, faFish } from "@fortawesome/free-solid-svg-icons";
import ImageView from "../../Components/ImageView";

const Result = ({ route, navigation }) => {
  const result = route.params;
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => {
    if (result.errors) {
      const errors = toErrorMap(result.errors);
      setErrorMessage(errors);
    }
  }, [setErrorMessage]);

  const DetailsView = (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        margin: 30,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageView result={result} />
      </View>
    </View>
  );

  const NormalView = (
    <View style={myStyles.parentContainer}>
      <ScrollView>{DetailsView}</ScrollView>
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
    </View>
  );

  return NormalView;
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

  parentContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
});

export default Result;
