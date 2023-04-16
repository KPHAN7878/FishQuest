import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import styles, { height, width } from "../../styles";
import { toErrorMap } from "../../utils/toErrorMap";
import { AnimatedButton } from "../../Components/Button";

const Result = ({ route, navigation }) => {
  const result = route.params;
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => {
    if (result.errors) {
      const errors = toErrorMap(result.errors);
      setErrorMessage(errors);
    }
  }, [setErrorMessage]);

  const ProblemView = (
    <View
      style={{
        marginTop: height * 0.15,
      }}
    >
      <Text style={styles.fieldError}>
        {errorMessage ? errorMessage["camera"] : "Something went wrong"}
      </Text>
      <Pressable
        style={styles.formButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={styles.buttonText}>{"Retake photo"}</Text>
      </Pressable>
      <Text style={{}}>{"Continue without gaining experience"}</Text>

      <AnimatedButton
        style={styles.formButton}
        next={() => {
          setErrorMessage(null);
        }}
      >
        <Text style={styles.buttonText}>{"Continue"}</Text>
      </AnimatedButton>
    </View>
  );

  const DetailsView = (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: (height - height * 0.1) / 2,
      }}
    >
      <Text
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        fhasdljfhsdkajfldhsafkjllka
      </Text>
    </View>
  );

  const NormalView = (
    <View style={myStyles.parentContainer}>
      {DetailsView}
      <View style={myStyles.container}>
        <View
          style={[
            styles.buttonContainer,
            {
              backgroundColor: "white",
              padding: 10,
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
            <Text style={{ color: "gray", fontSize: 24, flex: 1, padding: 10 }}>
              {"Post Catch"}
            </Text>
          </AnimatedButton>

          <AnimatedButton
            style={{ ...myStyles.button }}
            next={() => {
              navigation.navigate("CatchLogger");
            }}
          >
            <Text
              style={{
                padding: 10,
                color: "gray",
                fontSize: 24,
                flex: 1,
              }}
            >
              {"Continue"}
            </Text>
          </AnimatedButton>
        </View>
      </View>
    </View>
  );

  return errorMessage ? ProblemView : NormalView;
};

const myStyles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
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
