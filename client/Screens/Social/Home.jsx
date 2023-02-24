import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily, Color } from "../../GlobalStyles";

import MainContainer from "../../navigation/MainContainer";

const Tabs = createBottomTabNavigator();

const Home = () => {
  return (
    <>
    <View style={styles.headerBox}>
      <Text style={styles.fishQuest}>Fish Quest</Text>
    </View>
    <MainContainer/> 
    </>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    marginTop: 0,
    padding: 55,
    borderWidth: 0.3,
    borderColor: "#787777",
    backgroundColor: "#2596be",
  },
  fishQuest: {
    top: 40,
    left: 121,
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
    position: "absolute",
  },
});


export default Home;
