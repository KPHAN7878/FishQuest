import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import { FontFamily, Color } from "../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";

import MainContainer from "../../navigation/MainContainer";

var { height } = Dimensions.get("window");
var { width } = Dimensions.get("window");

const Tabs = createBottomTabNavigator();

const Home = () => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.headerBox}>
        <Text style={styles.fishQuest}>Fish Quest</Text>
        <Pressable
          style={styles.searchButton}
          onPress={async () => {
            navigation.navigate("UserSearch");
          }}
        >
          <Image
            source={require("../../assets/search_icon.png")}
            style={{ height: 35, width: 35 }}
          />
        </Pressable>
      </View>
      <MainContainer />
    </>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    marginTop: 0,
    //padding: 55,
    paddingTop: 45,
    borderWidth: 0.3,
    borderColor: "#787777",
    backgroundColor: "#2596be",
    flexDirection: "row",
    justifyContent: "space-between",
    //justifyContent: 'center',
    alignItems: "center",
    //flex: 1
  },
  fishQuest: {
    //top: 40,
    //left: 121,
    left: width / 3.4,
    fontSize: 44,
    fontFamily: FontFamily.alluraRegular,
    width: 195,
    height: 63,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 4,
    },
    textShadowRadius: 4,
    textAlign: "left",
    color: Color.black,
    alignSelf: "center",
    //position: "absolute",
  },
  searchButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    //paddingHorizontal: 40,
    //borderRadius: 10,
    elevation: 3,
    //backgroundColor: 'red',
    //alignSelf: 'flex-end',
    marginRight: width * 0.05,
    marginBottom: height * 0.05 * 0.16,
    //width: 140,
  },
});

export default Home;
