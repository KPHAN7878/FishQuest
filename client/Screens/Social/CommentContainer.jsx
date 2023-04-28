import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
  Image,
  TouchableOpacity,
} from "react-native";
import styles from "../../styles";

import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
} from "react-native-reanimated";
import { FontFamily, Color } from "../../GlobalStyles";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Client } from "../../utils/connection";

const windowHeight = Dimensions.get("window").height;

const CommentContainer = ({ route, navigation }) => {
  const [text, onChangeText] = React.useState();
  const [commentsDB, setComments] = useState();
  const [isChildBool, setIsChild] = useState();

  const [screenState, setScreenState] = React.useState(0);
  const animateDetails = useAnimatedStyle(() => {
    const interpolation = interpolate(screenState, [0, 1], [0, -350]);

    return {
      transform: [{ translateY: withTiming(interpolation, { duration: 250 }) }],
    };
  });

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

  const submitComment = async () => {
    console.log("in submit comment function");
    console.log("commentableId: " + route.params.caption.id);
    console.log("text: " + text);

    if (!route.params.caption.isChild) {
      await Client.post("comment", {
        commentableId: route.params.caption.id,
        text: text,
        type: "post",
      })
        .then((res) => {
          console.log("\ncreate comment response: " + JSON.stringify(res));
          getComments();
        })
        .catch((error) => {
          console.log("error comment: " + error);
        });
    } else {
      await Client.post("comment", {
        commentableId: route.params.caption.id,
        text: text,
        type: "comment",
      })
        .then((res) => {
          console.log("\ncreate comment response: " + JSON.stringify(res));
          getComments();
        })
        .catch((error) => {
          console.log("error comment: " + error);
        });
    }
  };

  const getComments = async () => {
    if (!route.params.caption.isChild) {
      await Client.get(
        "comment/get-commentsV2/100," + route.params.caption.id + ",post"
      )
        .then((res) => {
          console.log("\nNOOOOOO!!!\n\n");
          console.log("comments: " + JSON.stringify(res) + "\n\n");
          setComments(res.data.comments.reverse());
          console.log("comment array: " + commentsDB);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await Client.get(
        "comment/get-commentsV2/100," + route.params.caption.id + ",comment"
      )
        .then((res) => {
          console.log("\n\nYAY!!!\n\n");
          console.log("comments: " + JSON.stringify(res) + "\n\n");
          setComments(res.data.comments.reverse());
          console.log("comment array: " + commentsDB);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  React.useEffect(() => {
    // if (route.params.caption.isChild)
    // {
    //   setIsChild(true);
    // }

    console.log("\n\nUSEFFECT: " + route.params.caption.isChild);
    const unsubscribe = navigation.addListener("focus", () => {
      if (route.params.caption.isChild) {
        setIsChild(true);
      }
      console.log("after setchild: " + isChildBool);
      getComments();
    });
    //getComments();
    // console.log("route: " + JSON.stringify(route.params))
  }, []);

  return (
    <View>
      <View style={styles2.headerBox}>
        <Text style={styles2.fishQuest}>Fish Quest</Text>

        <TouchableOpacity
          style={styles2.back}
          activeOpacity={0.2}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View>
        {!isChildBool ? (
          <Text style={styles2.postCaption}>{route.params.caption.text}</Text>
        ) : (
          <View></View>
        )}
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 2,
            width: "100%",
            alignSelf: "center",
            marginTop: 40,
          }}
        />
      </View>

      <ScrollView style={styles2.comments}>
        {commentsDB ? (
          commentsDB.map((comment, idx) => (
            <Pressable
              key={idx}
              onPress={() => {
                navigation.push("CommentContainer", {
                  caption: { id: comment.id, isChild: true },
                });
              }}
            >
              <View>
                {console.log("commentsDB: " + JSON.stringify(commentsDB))}
                <View key={comment.id} style={styles2.comment}>
                  <Image
                    style={styles2.img}
                    source={require("../../assets/profilePic.jpg")}
                  />
                  <View style={styles2.info}>
                    <Text style={styles2.userName}>
                      {comment.creator.username}
                    </Text>
                    <Text style={styles2.desc}>{comment.text}</Text>
                  </View>
                  <Text style={styles2.date}>1 hour ago</Text>
                </View>
                <View style={styles2.line} />
              </View>
            </Pressable>
          ))
        ) : (
          <View></View>
        )}
      </ScrollView>

      <Animated.View style={[styles2.typeComment, animateDetails]}>
        <Image
          style={styles2.img}
          source={require("../../assets/profilePic.jpg")}
        />
        <View style={styles2.input}>
          <TextInput
            placeholder="write a comment..."
            style={{ flex: 4 }}
            onFocus={() => setScreenState(1)}
            onChangeText={(text) => onChangeText(text)}
          />
          <TouchableOpacity
            style={[{ flex: 1 }]}
            onPress={() => {
              submitComment();
            }}
          >
            <Text style={[{ fontSize: 14 }]}>{"Submit"}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles2 = StyleSheet.create({
  headerBox: {
    marginTop: 0,
    padding: 50,
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
  line: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "75%",
    alignSelf: "center",
    marginTop: 20,
  },
  back: {
    left: 320,
  },
  postCaption: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  comments: {
    height: windowHeight * 0.6,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  typeComment: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  input: {
    flex: 5,
    display: "flex",
    flexDirection: "row",
    marginLeft: 10,
    width: "65%",
    padding: 10,
    borderWidth: 1,
    backgroundColor: "white",
  },
  comment: {
    marginTop: 25,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
  },
  info: {
    flex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  userName: {
    fontWeight: "500",
  },
  desc: {
    // fontFamily: FontFamily.interRegular,
  },
  date: {
    flex: 1,
    alignSelf: "center",
    right: -15,
    color: "gray",
    fontSize: 12,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: "contain",
  },
  comment2: {
    marginTop: 25,
    marginBottom: 0,
    marginLeft: 45,
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
  },
});

export default CommentContainer;
